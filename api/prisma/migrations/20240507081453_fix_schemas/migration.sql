/*
  Warnings:

  - You are about to drop the column `logOnId` on the `Amendment` table. All the data in the column will be lost.
  - You are about to drop the `LogOff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OtherPatrolsInAmendment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OtherPatrolsInLogOff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OtherPatrolsInLogOn` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `otherPatrolsName` to the `Amendment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftId` to the `Amendment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "logType" AS ENUM ('logOn', 'logOff');

-- DropForeignKey
ALTER TABLE "Amendment" DROP CONSTRAINT "Amendment_logOnId_fkey";

-- DropForeignKey
ALTER TABLE "LogOff" DROP CONSTRAINT "LogOff_logOffPatrolId_fkey";

-- DropForeignKey
ALTER TABLE "LogOff" DROP CONSTRAINT "LogOff_logOnId_fkey";

-- DropForeignKey
ALTER TABLE "LogOff" DROP CONSTRAINT "LogOff_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "LogOn" DROP CONSTRAINT "LogOn_logOnPatrolId_fkey";

-- DropForeignKey
ALTER TABLE "LogOn" DROP CONSTRAINT "LogOn_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "OtherPatrolsInAmendment" DROP CONSTRAINT "OtherPatrolsInAmendment_amendmentId_fkey";

-- DropForeignKey
ALTER TABLE "OtherPatrolsInAmendment" DROP CONSTRAINT "OtherPatrolsInAmendment_patrolId_fkey";

-- DropForeignKey
ALTER TABLE "OtherPatrolsInLogOff" DROP CONSTRAINT "OtherPatrolsInLogOff_LogOffId_fkey";

-- DropForeignKey
ALTER TABLE "OtherPatrolsInLogOff" DROP CONSTRAINT "OtherPatrolsInLogOff_patrolId_fkey";

-- DropForeignKey
ALTER TABLE "OtherPatrolsInLogOn" DROP CONSTRAINT "OtherPatrolsInLogOn_LogOnId_fkey";

-- DropForeignKey
ALTER TABLE "OtherPatrolsInLogOn" DROP CONSTRAINT "OtherPatrolsInLogOn_patrolId_fkey";

-- AlterTable
ALTER TABLE "Amendment" DROP COLUMN "logOnId",
ADD COLUMN     "otherPatrolsName" TEXT NOT NULL,
ADD COLUMN     "shiftId" INTEGER NOT NULL,
ADD COLUMN     "shiftType" "logType" NOT NULL DEFAULT 'logOn',
ALTER COLUMN "hasLiveryOrSignage" DROP NOT NULL,
ALTER COLUMN "hasPoliceRadio" DROP NOT NULL;

-- DropTable
DROP TABLE "LogOff";

-- DropTable
DROP TABLE "LogOn";

-- DropTable
DROP TABLE "OtherPatrolsInAmendment";

-- DropTable
DROP TABLE "OtherPatrolsInLogOff";

-- DropTable
DROP TABLE "OtherPatrolsInLogOn";

-- CreateTable
CREATE TABLE "Shifts" (
    "id" SERIAL NOT NULL,
    "type" "logType" NOT NULL,
    "logOffAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedHours" DECIMAL(65,30),
    "actualHours" DECIMAL(65,30),
    "policeStationBase" TEXT NOT NULL,
    "cpCallSign" TEXT NOT NULL,
    "logPatrolId" INTEGER NOT NULL,
    "otherPatrolsName" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "hasLiveryOrSignage" BOOLEAN NOT NULL,
    "hasPoliceRadio" BOOLEAN NOT NULL,

    CONSTRAINT "Shifts_pkey" PRIMARY KEY ("id","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shifts_id_key" ON "Shifts"("id");

-- AddForeignKey
ALTER TABLE "Shifts" ADD CONSTRAINT "Shifts_logPatrolId_fkey" FOREIGN KEY ("logPatrolId") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shifts" ADD CONSTRAINT "Shifts_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amendment" ADD CONSTRAINT "Amendment_shiftId_shiftType_fkey" FOREIGN KEY ("shiftId", "shiftType") REFERENCES "Shifts"("id", "type") ON DELETE RESTRICT ON UPDATE CASCADE;
