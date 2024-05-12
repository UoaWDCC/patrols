/*
  Warnings:

  - You are about to drop the column `logOffAt` on the `Amendment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Amendment" DROP COLUMN "logOffAt",
ADD COLUMN     "amendmentMadeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
