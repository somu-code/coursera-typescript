import { Router } from "express";

import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>User api</h1>");
  } catch (error) { }
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = await req.body
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

userRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = await req.body;
    const userEmail = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!userEmail) {
      return res.status(404).json({ message: "User email not found" });
    }
    const userFromDatabase = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    await prisma.$disconnect();
    const isPasswordMatch = await bcrypt.compare(
      password,
      userFromDatabase!.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
      return res.json({ message: "Logged in successfully", email });
    }
  } catch (error) {
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});
