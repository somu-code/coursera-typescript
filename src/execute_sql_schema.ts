import { Client } from "pg";
import fs from "fs";

const client = new Client({
  user: "postgres",
  password: "randompassword",
  host: "localhost",
  port: 5432,
  database: "e-learning-application",
});

export async function excuteSqlSchema() {
  await client.connect();
  client.query(
    fs.readFileSync("../schema.sql", { encoding: "utf-8" }).toString(),
    (err, res) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      client.end();
    }
  );
}
