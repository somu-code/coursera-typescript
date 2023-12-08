import e, { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { authenticateAdminJWT, generateAdminJWT } from "../jwt-auth/admin-auth";
import { Admin, adminPayload } from "../custom-types/admin-types";
import { Course } from "../custom-types/course-types";

export const adminRouter = Router();

adminRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } =
      await req.body;
    const adminData: Admin = await prisma.admin.findFirst({
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
    res.json({ message: "Admin created successfully" });
  } catch (error) {
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});

adminRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const adminData: Admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    await prisma.$disconnect();
    if (!adminData) {
      return res.status(404).json({ message: "Admin email not found" });
    } else {
      const isPasswordMatch = await bcrypt.compare(
        password,
        adminData.hashedPassword
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      } else {
        const { id, email, role } = adminData;
        const adminPayload: adminPayload = { id, email, role };
        const adminToken: string = generateAdminJWT(adminPayload);
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
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});

adminRouter.get(
  "/profile",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedAdmin: decodedAdmin = req.decodedAdmin;
      const adminData: Admin = await prisma.admin.findUnique({
        where: {
          email: decodedAdmin.email,
        },
      });
      await prisma.$disconnect();
      res.json({
        email: adminData?.email,
        name: adminData?.name,
        role: adminData?.role,
      });
    } catch (error) {
      await prisma.$disconnect();
      res.sendStatus(500);
    }
  }
);

adminRouter.post(
  "/logout",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("loggedIn");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

adminRouter.delete(
  "/delete",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const decodedAdmin: decodedAdmin = req.decodedAdmin;
      await prisma.admin.delete({
        where: {
          email: decodedAdmin.email,
        },
      });
      await prisma.$disconnect();
      res.clearCookie("accessToken");
      res.clearCookie("loggedIn");
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      await prisma.$disconnect();
      res.sendStatus(500);
    }
  }
);

adminRouter.post(
  "/create-course",
  authenticateAdminJWT,
  async (req: Request, res: Response) => {
    try {
      const { title, description, published, imageUrl, price } = await req.body;
      const decodedAdmin: decodedAdmin = req.decodedAdmin;
      const course: {
        adminId: number;
        title: string;
        description: string;
        published: boolean;
        imageUrl: string;
        price: number;
      } = {
        adminId: decodedAdmin.id,
        title,
        description,
        published,
        imageUrl,
        price,
      };
      await prisma.course.create({
        data: course,
      });
      await prisma.$disconnect();
      res.json({ message: "Course created successfully", course });
    } catch (error) {
      await prisma.$disconnect();
      res.sendStatus(500);
    }
  }
);

// adminRouter.post(
//   "/create-course",
//   authenticateAdminJWT,
//   async (req: Request, res: Response) => {
//     try {
//       const courseData: Course = await req.body;
//       // const decodedAdmin: decodedAdmin = req.decodedAdmin;
//       // const adminId: number = decodedAdmin
//       const data = await prisma.course.create({
//         data: courseData,
//       });
//       await prisma.$disconnect();
//       res.json({
//         message: "Course created successfully",
//         courseData,
//       });
//     } catch (error) {
//       await prisma.$disconnect();
//       res.sendStatus(500);
//     }
//   },
// );

// adminRouter.put(
//   "/update",
//   authenticateAdminJWT,
//   async (req: Request, res: Response) => {
//     try {
//       const courseData: Course = await req.body;
//       await prisma.course.update({
//         where: { id: courseData.id },
//       });
//       await prisma.$disconnect();
//       res.json({
//         message: "Course updated successfully",
//         courseData,
//       });
//     } catch (error) {
//       await prisma.$disconnect();
//       res.sendStatus(500);
//     }
//   },
// );
