import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { adminRouter } from "./routes/admin.js";
import { userRouter } from "./routes/user.js";
import cors from "cors";

dotenv.config({
  override: true,
  path: path.join(__dirname, "../.env"),
});
const app: Express = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser("my-secret"));

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.get("/ping", async (_req: Request, res: Response) => {
  try {
    res.send("pong");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `Express server is listening on http://localhost:${process.env.PORT}`,
  );
});
