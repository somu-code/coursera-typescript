import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { adminRouter } from "./routes/admin.ts";
import { userRouter } from "./routes/user.ts";

dotenv.config({
  override: true,
  path: path.join(__dirname, "../.env"),
});

const app: Express = express();
app.use(express.json());

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
