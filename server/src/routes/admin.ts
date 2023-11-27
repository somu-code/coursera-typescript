import { Router } from "express";

export const adminRouter = Router();

adminRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>Admin api</h1>");
  } catch (error) {
    res.sendStatus(500);
  }
});
