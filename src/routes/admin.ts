import { Router, Request, Response } from "express";

export const adminRouter = Router();

adminRouter.get("/profile", async (req: Request, res: Response) => {
  try {
    res.status(200).send("Admin api");
  } catch (error) {
    res.sendStatus(500);
  }
});
adminRouter.post("/login", async(req: Request, res: Response)=>{

})

adminRouter.post("/signUp", async(req: Request, res: Response)=>{

})
