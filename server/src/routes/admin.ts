import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { authenticateAdminJWT, generateAdminJWT } from "../jwt-auth/admin-auth";
import { Admin, adminPayload } from "../custom-types/admin-types";
import {
  Course,
  CourseFromDB,
  CourseWithAdminId,
} from "../custom-types/course-types";
import {
  courseFromDBScheam,
  courseIdSchema,
  createCourseSchema,
  signupSchema,
} from "../zod/zod-types";

export const adminRouter: Router = Router();

adminRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsedInput = signupSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ message: parsedInput.error.format() });
    } else {
      const { email, password }: { email: string; password: string } =
        parsedInput.data;
      const adminData: Admin | null = await prisma.admin.findUnique({
        where: { email: email },
      });
      if (adminData) {
        await prisma.$disconnect();
        return res.status(403).json({ message: "Admin email already exists" });
      }
      const hashedPassword: string = await bcrypt.hash(password, 8);
      await prisma.admin.create({
        data: {
          email,
          hashedPassword: hashedPassword,
        },
      });

      await prisma.$disconnect();
      return res.json({ message: "Admin created successfully" });
    }
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    res.sendStatus(500);
  }
});

adminRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const parsedInput = signupSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ message: parsedInput.error.format() });
    } else {
      const { email, password }: { email: string; password: string } =
        parsedInput.data;
      const adminData: Admin | null = await prisma.admin.findUnique({
        where: {
          email: email,
        },
      });
      await prisma.$disconnect();
      if (!adminData) {
        return res.status(404).json({ message: "Admin email not found" });
      } else {
        const isPasswordMatch: boolean = await bcrypt.compare(
          password,
          adminData.hashedPassword,
        );
        if (!isPasswordMatch) {
          return res.status(401).json({ message: "Invalid password" });
        } else {
          const {
            id,
            email,
            name,
            role,
          }: { id: number; email: string; name: string | null; role: string } = adminData;
          const adminPayload: adminPayload = { id, email, name, role };
          const adminToken: string = generateAdminJWT(adminPayload);
          res.cookie("adminAccessToken", adminToken, {
            domain: "localhost",
            path: "/",
            maxAge: 60 * 60 * 1000,
            secure: true,
            sameSite: "strict",
          });
        }
        return res.json({ message: "Signin in successfully" });
      }
    }
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    res.sendStatus(500);
  }
});

adminRouter.get(
  "/profile",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedAdmin: decodedAdmin = req.decodedAdmin;
      const adminData: Admin | null = await prisma.admin.findUnique({
        where: {
          id: decodedAdmin.id,
        },
      });
      await prisma.$disconnect();
      res.json({
        id: adminData?.id,
        email: adminData?.email,
        name: adminData?.name,
        role: adminData?.role
      });
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);

adminRouter.post(
  "/logout",
  authenticateAdminJWT,
  async (_req: Request, res: Response) => {
    try {
      res.clearCookie("adminAccessToken");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
);

adminRouter.delete(
  "/delete",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedAdmin: decodedAdmin = req.decodedAdmin;
      await prisma.admin.delete({
        where: {
          id: decodedAdmin.id,
        },
      });
      await prisma.$disconnect();
      res.clearCookie("adminAccessToken");
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);

// Courses

adminRouter.post(
  "/create-course",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const parsedInput = createCourseSchema.safeParse(req.body);
      if (!parsedInput.success) {
        return res.status(411).json({ message: "zod" });
      } else {
        const { title, description, published, imageUrl, price }: Course =
          parsedInput.data;
        const decodedAdmin: decodedAdmin = req.decodedAdmin;
        const createCourse: CourseWithAdminId = {
          adminId: decodedAdmin.id,
          title,
          description,
          published,
          imageUrl,
          price,
        };
        await prisma.course.create({
          data: createCourse,
        });
        await prisma.$disconnect();
        res.json({ message: "Course created successfully" });
      }
    } catch (error) {
      await prisma.$disconnect();
      console.error(error);
      res.sendStatus(500);
    }
  },
);

adminRouter.put(
  "/update-course",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const parsedInput = courseFromDBScheam.safeParse(req.body);
      if (!parsedInput.success) {
        return res.status(411).json({ message: parsedInput.error.format() });
      } else {
        const updatedCourse: CourseFromDB = parsedInput.data;
        const decodedAdmin: decodedAdmin = req.decodedAdmin;
        if (decodedAdmin.id === updatedCourse.adminId) {
          await prisma.course.update({
            where: {
              id: updatedCourse.id,
              adminId: decodedAdmin.id,
            },
            data: updatedCourse,
          });
          await prisma.$disconnect();
          return res.json({ message: "Course updated successfully" });
        } else {
          return res
            .status(403)
            .json({ message: "The course does not belong to this admin." });
        }
      }
    } catch (error) {
      await prisma.$disconnect();
      console.log(error);
      res.sendStatus(500);
    }
  },
);

adminRouter.delete(
  "/delete-course",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedAdmin: decodedAdmin = req.decodedAdmin;
      const parsedInput = courseIdSchema.safeParse(req.body);
      if (!parsedInput.success) {
        return res.status(411).json({ message: parsedInput.error.format() })
      } else {
        const { courseId } = parsedInput.data;
        const currentCourse: CourseFromDB | null = await prisma.course.findUnique(
          {
            where: { id: courseId },
          },
        );
        if (!currentCourse) {
          return res.status(404).json({ message: "Course does not exists" });
        }
        if (currentCourse.adminId === decodedAdmin.id) {
          await prisma.course.delete({
            where: { id: courseId },
          });
          await prisma.$disconnect();
          return res.json({ message: "Course deleted successfully" });
        } else {
          return res
            .status(403)
            .json({ message: "The course does not belong to this admin." });
        }
      }
    } catch (error) {
      await prisma.$disconnect();
      console.log(error);
      res.sendStatus(500);
    }
  },
);

adminRouter.get(
  "/my-courses",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedAdmin: decodedAdmin = req.decodedAdmin;
      const courses: CourseFromDB[] = await prisma.course.findMany({
        where: { adminId: decodedAdmin.id },
      });
      await prisma.$disconnect();
      res.json(courses);
    } catch (error) {
      await prisma.$disconnect();
      console.log(error);
      res.sendStatus(500);
    }
  },
);

adminRouter.get(
  "/all-courses",
  authenticateAdminJWT,
  async (_req: Request, res: Response) => {
    try {
      const courses: CourseFromDB[] = await prisma.course.findMany();
      await prisma.$disconnect();
      res.json(courses);
    } catch (error) {
      await prisma.$disconnect();
      console.log(error);
      res.sendStatus(500);
    }
  },
);
