/*
  Warnings:

  - You are about to drop the column `title` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "mimetype" VARCHAR(255) NOT NULL,
ADD COLUMN     "path" VARCHAR(255) NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "title",
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
