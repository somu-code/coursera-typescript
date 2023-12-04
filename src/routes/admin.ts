import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";

export const adminRouter = Router();



adminRouter.get("/profile", async (req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany()

    res.status(200).send(admins);
  } catch (error) {
    res.sendStatus(500);
  }
});

adminRouter.get("/profile/:id", async (req: Request, res: Response) => {
  try {

    const id = req.params.id;
    const singleAdmin = await prisma.admin.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    res.status(200).send(singleAdmin);
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
adminRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const deletedAdmin = await prisma.admin.delete({
      where: {
        id: parseInt(id),
      },

    })
    res.send(`Admin Deleted Successfully`).status(200)
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
  }
})
