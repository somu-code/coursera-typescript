import { Router } from "express";

import { prisma } from "../prismaClient";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>User api</h1>");
  } catch (error) { }
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = await req.body;
    // await prisma.user.create({
    //   data: {
    //     email: email,
    //     password: password,
    //   },
    // });
    // await prisma.$disconnect();
    // res.json({
    //   message: "User created successfully",
    // });
  } catch (error) {
    await prisma.$disconnect();
    res.sendStatus(500);
  }
});
