import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import { generateJWT } from "../jwt-auth/tools";

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
  const { email, password } = req.body

  const admin = await prisma.admin.findUnique({
    where: {
      email: email
    }
  })
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" })
  } else {
    const isPasswordMatch = await bcrypt.compare(password, admin.password)
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" })
    } else {
      const token = await generateJWT(email)
      res.cookie("accessToken", token, {
        domain: "localhost",
        path: "/",
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      res.cookie("loggedIn", true, {
        domain: "localhost",
        path: "/",
        maxAge: 60 * 60 * 1000,
        secure: true,
        sameSite: "strict",
      })
      return res.json({ message: "Logged in successfully" })

    }

  }
});



adminRouter.post("/signup", async (req: Request, res: Response) => {

  try {
    const { email, password, name }: { email: string, password: string, name: string } = req.body
    const hashedNewAdmin: string = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        email, name, password: hashedNewAdmin
      }
    })
    res.status(201).send(`${name} has been created`)
    // console.log(newAdmin);
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
