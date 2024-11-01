/*
  Warnings:

  - You are about to drop the `_UserCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserCourse" DROP CONSTRAINT "_UserCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserCourse" DROP CONSTRAINT "_UserCourse_B_fkey";

-- DropTable
DROP TABLE "_UserCourse";

-- CreateTable
CREATE TABLE "UserCourses" (
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "UserCourses_pkey" PRIMARY KEY ("userId","courseId")
);

-- AddForeignKey
ALTER TABLE "UserCourses" ADD CONSTRAINT "UserCourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourses" ADD CONSTRAINT "UserCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
