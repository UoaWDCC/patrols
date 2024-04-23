/*
  Warnings:

  - The primary key for the `IncidentType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reportID` on the `IncidentType` table. All the data in the column will be lost.
  - Added the required column `reportIncidentType` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IncidentType" DROP CONSTRAINT "IncidentType_reportID_fkey";

-- DropIndex
DROP INDEX "IncidentType_reportID_key";

-- DropIndex
DROP INDEX "Reports_patrolID_key";

-- DropIndex
DROP INDEX "Vehicles_patrolID_key";

-- AlterTable
ALTER TABLE "IncidentType" DROP CONSTRAINT "IncidentType_pkey",
DROP COLUMN "reportID",
ADD CONSTRAINT "IncidentType_pkey" PRIMARY KEY ("incidentType");

-- AlterTable
ALTER TABLE "Reports" ADD COLUMN     "reportIncidentType" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_reportIncidentType_fkey" FOREIGN KEY ("reportIncidentType") REFERENCES "IncidentType"("incidentType") ON DELETE RESTRICT ON UPDATE CASCADE;
