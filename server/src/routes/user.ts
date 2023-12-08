import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { authenticateUserJWT, generateUserJWT } from "../jwt-auth/user-auth";
import { User, userPayload } from "../custom-types/user-types";
import { Course } from "../custom-types/course-types";

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
        hashedPassword: hashedPassword,
      },
    });
    await prisma.$disconnect();
    res.json({
      message: "User created successfully",
    });
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
      userData!.hashedPassword,
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
      const { id, email, role }: { id: number; email: string; role: string } =
        userData;
      const userPayload: userPayload = { id, email, role };
      const userToken: string = generateUserJWT(userPayload);
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
    const decodedUser: decodedUser = req.decodedUser;
    const userData: User = await prisma.user.findFirst({
      where: { id: decodedUser.id },
    });
    await prisma.$disconnect();
    res.json({
      id: userData?.id,
      email: userData?.email,
      name: userData?.name,
      role: userData?.role,
    });
  } catch (error) {
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});

userRouter.post("/logout", authenticateUserJWT, async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("loggedIn");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.sendStatus(500);
  }
});

userRouter.delete("/delete", authenticateUserJWT, async (req, res) => {
  try {
    const decodedUser: decodedUser = req.decodedUser;
    await prisma.user.delete({
      where: { id: decodedUser.id },
    });
    await prisma.$disconnect();
    res.clearCookie("accessToken");
    res.clearCookie("loggedIn");
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    res.sendStatus(500);
  }
});

userRouter.get(
  "/get-all-courses",
  authenticateUserJWT,
  async (req: Request, res: Response) => {
    try {
      const courseData = await prisma.course.findMany();
      await prisma.$disconnect();
      res.json(courseData);
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);

userRouter.post(
  "/purchase-course",
  authenticateUserJWT,
  async (req: Request, res: Response) => {
    try {
      const { courseId }: { courseId: number } = await req.body;
      const decodedUser: decodedUser = req.decodedUser;
      const result = await prisma.userCourses.create({
        data: {
          user: {
            connect: { id: decodedUser.id },
          },
          course: {
            connect: { id: courseId },
          },
        },
      });
      await prisma.$disconnect();
      res.json({
        message: `User id ${decodedUser.id} brought course id ${courseId}`,
      });
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);

userRouter.get(
  "/my-courses",
  authenticateUserJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedUser: decodedUser = req.decodedUser;
      const coursesOfUser = prisma.user.findUnique({
        where: {
          id: decodedUser.id,
        },
        include: {
          UserCourses: {
            select: {
              course: true,
            },
          },
        },
      });
      await prisma.$disconnect();
      res.json({ coursesOfUser });
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);
