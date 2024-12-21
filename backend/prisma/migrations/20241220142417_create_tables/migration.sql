/*
  Warnings:

  - You are about to drop the column `body` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Menu` table. All the data in the column will be lost.
  - Added the required column `depth` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Menu_title_key";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "body",
DROP COLUMN "description",
DROP COLUMN "published",
DROP COLUMN "title",
ADD COLUMN     "depth" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "parentId" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "Menu_parentId_idx" ON "Menu"("parentId");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
