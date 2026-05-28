/*
  Warnings:

  - The `language` column on the `Content` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "language",
ADD COLUMN     "language" TEXT[];
