import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { authenticateAdminJWT, generateAdminJWT } from "../jwt-auth/admin-auth";
import { Admin } from "../custom-types/admin-types";

export const adminRouter = Router();

adminRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } =
      await req.body;
    const hashedPassword: string = await bcrypt.hash(password, 8);
    const newAdmin: Admin = await prisma.admin.create({
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
    const admin: Admin = await prisma.admin.findUnique({
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
      res.json({
        email: adminData?.email,
        name: adminData?.name,
        role: adminData?.role,
      });
    } catch (error) {
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
      const deletedAdmin = await prisma.admin.delete({
        where: {
          email: decodedAdmin.email,
        },
      });
      res.clearCookie("accessToken");
      res.clearCookie("loggedIn");
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);
