import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { authenticateUserJWT, generateUserJWT } from "../jwt-auth/user-auth";
import { User, userPayload } from "../custom-types/user-types";
import { CourseFromDB } from "../custom-types/course-types";
import { purchaseCourseSchema, signupSchema } from "../zod/zod-types";

export const userRouter: Router = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsedInput = signupSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ message: "zod" });
    } else {
      const { email, password }: { email: string; password: string } =
        parsedInput.data;
      const userData: User | null = await prisma.user.findFirst({
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
    }
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    res.sendStatus(500);
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const parsedInput = signupSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ message: "zod" });
    } else {
      const { email, password }: { email: string; password: string } =
        parsedInput.data;
      const userData: User | null = await prisma.user.findFirst({
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
        res.cookie("userAccessToken", userToken, {
          domain: "localhost",
          path: "/",
          maxAge: 60 * 60 * 1000,
        });
      }
      return res.json({
        message: "Logged in successfully",
        userData: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
        },
      });
    }
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    res.sendStatus(500);
  }
});

userRouter.get(
  "/profile",
  authenticateUserJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedUser: decodedUser = req.decodedUser;
      const userData: User | null = await prisma.user.findFirst({
        where: { id: decodedUser.id },
      });
      await prisma.$disconnect();
      res.json({
        name: userData?.name,
      });
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);

userRouter.post("/logout", authenticateUserJWT, async (_req, res) => {
  try {
    res.clearCookie("userAccessToken");
    res.clearCookie("userLoggedIn");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
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
    res.clearCookie("userAccessToken");
    res.clearCookie("userLoggedIn");
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    res.sendStatus(500);
  }
});

// Courses

userRouter.get(
  "/all-courses",
  authenticateUserJWT,
  async (_req: Request, res: Response) => {
    try {
      const courseData: CourseFromDB[] = await prisma.course.findMany();
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
      const parsedInput = purchaseCourseSchema.safeParse(req.body);
      if (!parsedInput.success) {
        return res.status(411).json({ message: "zod" });
      } else {
        const { courseId }: { courseId: number } = parsedInput.data;
        const decodedUser: decodedUser = req.decodedUser;
        await prisma.userCourses.create({
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
      }
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
      const userWithCourses = await prisma.user.findUnique({
        where: {
          id: decodedUser.id,
        },
        select: {
          UserCourses: {
            select: {
              course: true,
            },
          },
        },
      });
      await prisma.$disconnect();
      res.json(userWithCourses);
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);
