import { Client } from "pg";

const client = new Client({
    user: "postgres",
    password: "randompassword",
    host: "localhost",
    port: 5432,
    database: "e-learning-application"
});

client.connect()