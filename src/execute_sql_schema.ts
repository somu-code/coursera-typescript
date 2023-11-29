import { Client } from "pg";
import fs from "fs";

const client = new Client({
  user: "postgres",
  password: "randompassword",
  host: "localhost",
  port: 5432,
});

export async function excuteSqlSchema() {
  await client.connect();
  const path = "./first.txt";
  const data = fs.readFileSync(path, { encoding: "utf-8", flag: "r" });
  console.log(data);

  client.query(
    fs.readFileSync(path, { encoding: "utf-8", flag: "r" }).toString(),
    (err, res) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      client.end();
    }
  );
}
