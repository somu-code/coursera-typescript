import { Router } from "express";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>User api</h1>");
  } catch (error) {}
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = await req.body;
    res.json({
      email,
      password,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});
