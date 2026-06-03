/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "posterUrl" TEXT;
