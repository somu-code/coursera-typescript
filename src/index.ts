import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

import { adminRouter } from "./routes/admin.ts";
import { userRouter } from "./routes/user.ts";

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.get("/", async (req: Request, res: Response) => {
  try {
    res.send("<h1>Hello, world!</h1>");
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `Express server is listening on http://localhost:${process.env.PORT}`
  );
});
