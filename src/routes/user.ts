import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>User api</h1>");
  } catch (error) {}
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = await req.body;
    const userEmail = await prisma.user.findFirst({
      where: { email: email },
    });
    if (userEmail) {
      await prisma.$disconnect();
      return res.status(403).json({ message: "User email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
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
