import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";

export const adminRouter = Router();



adminRouter.get("/profile", async (req: Request, res: Response) => {
  try {
    res.status(200).send("Admin api");
  } catch (error) {
    res.sendStatus(500);
  }
});
adminRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password, name } = req.body
  res.send({ Email: email, Name: name }).status(200)
})



adminRouter.post("/signup", async (req: Request, res: Response) => {

  try {
    const { email, password, name } = req.body
    const newAdmin = await prisma.admin.create({
      data: {
        email, name, password
      }
    })
    res.status(201).send({ Email: email, Name: name, Password: password })
    console.log(newAdmin);
  } catch (error) {

    await prisma.$disconnect();
    res.sendStatus(500);
  }
}

)
