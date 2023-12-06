import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { generateAdminJWT } from "../jwt-auth/admin-auth";

export const adminRouter = Router();

adminRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } =
      await req.body;
    const hashedPassword: string = await bcrypt.hash(password, 8);
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.json({ message: "Admin created successfully" });
  } catch (error) {
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});

adminRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin email not found" });
    } else {
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      } else {
        const adminToken: string = generateAdminJWT(email);
        res.cookie("accessToken", adminToken, {
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
        return res.json({ message: "Logged in successfully" });
      }
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

adminRouter.get("/profile", async (req: Request, res: Response) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email: req.params.email,
      },
    });

    res.status(200).send(admin);
  } catch (error) {
    res.sendStatus(500);
  }
});
adminRouter.get("/profile/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const singleAdmin = await prisma.admin.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).send(singleAdmin);
  } catch (error) {
    res.sendStatus(500);
  }
});

adminRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deletedAdmin = await prisma.admin.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.send(`Admin Deleted Successfully`).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
