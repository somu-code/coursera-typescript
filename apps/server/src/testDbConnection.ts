import { prisma } from "./prismaClient";

export async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Failed to connect to the database.", error);
  } finally {
    await prisma.$disconnect();
  }
}
