/*
  Warnings:

  - You are about to drop the column `authorId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_authorId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "authorId",
ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
