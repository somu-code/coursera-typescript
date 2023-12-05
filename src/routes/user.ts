import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { authenticateUserJWT, generateUserJWT } from "../jwt-auth/user-auth";
import { User } from "../custom-types/user-types";

export const userRouter: Router = Router();

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    res.status(200).send("<h1>User api</h1>");
  } catch (error) {
    res.sendStatus(500);
  }
});

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } =
      await req.body;
    const userData: User = await prisma.user.findFirst({
      where: { email: email },
    });
    if (userData) {
      await prisma.$disconnect();
      return res.status(403).json({ message: "User email already exists" });
    }
    const hashedPassword: string = await bcrypt.hash(password, 8);
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    res.json({
      message: "User created successfully",
    });
    await prisma.$disconnect();
  } catch (error) {
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } =
      await req.body;
    const userData: User = await prisma.user.findFirst({
      where: { email: email },
    });
    await prisma.$disconnect();
    if (!userData) {
      return res.status(404).json({ message: "User email not found" });
    }
    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      userData!.password,
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
      const userToken = await generateUserJWT(email);
      res.cookie("accessToken", userToken, {
        domain: "localhost",
        path: "/",
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.cookie("loggedIn", true, {
        domain: "localhost",
        path: "/",
        maxAge: 60 * 60 * 1000,
        secure: true,
        sameSite: "strict",
      });
      return res.json({ message: "Logged in successfully", email });
    }
  } catch (error) {
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});

userRouter.get("/profile", authenticateUserJWT, async (req, res) => {
  try {
    // const user = req.user;
    // res.json({ email: user.email });
    res.json({ message: "hello" });
  } catch (error) {
    res.sendStatus(500);
  }
});
