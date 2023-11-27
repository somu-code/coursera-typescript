import { Router } from "express";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>User api</h1>");
  } catch (error) {}
});
