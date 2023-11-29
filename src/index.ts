import express from "express";
import { excuteSqlSchema } from "./execute_sql_schema.js";

const app = express();
app.use(express.json());

import { adminRouter } from "./routes/admin.js";
import { userRouter } from "./routes/user.js";

app.use("/admin", adminRouter);
app.use("/user", userRouter);

excuteSqlSchema();

app.get("/", async (req, res) => {
  try {
    res.send("<h1>Hello, world!</h1>");
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(8080, () => {
  console.log(`Express server is listening on http://localhost:8080`);
});
