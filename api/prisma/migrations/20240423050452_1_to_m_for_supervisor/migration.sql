/*
  Warnings:

  - A unique constraint covering the columns `[supervisorID]` on the table `Patrols` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patrols" ALTER COLUMN "role" SET DEFAULT 'Patrol';

-- AlterTable
ALTER TABLE "Reports" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Patrols_supervisorID_key" ON "Patrols"("supervisorID");
