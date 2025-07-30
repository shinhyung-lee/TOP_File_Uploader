/*
  Warnings:

  - Added the required column `formattedTime` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formattedTime` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "formattedTime" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "formattedTime" VARCHAR(255) NOT NULL;
