/*
  Warnings:

  - You are about to drop the column `logOffAt` on the `Shifts` table. All the data in the column will be lost.
  - Added the required column `mobile` to the `Patrols` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Shifts_id_key";

-- AlterTable
ALTER TABLE "Amendment" ALTER COLUMN "otherPatrolsName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Patrols" ADD COLUMN     "mobile" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shifts" DROP COLUMN "logOffAt",
ADD COLUMN     "logAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
