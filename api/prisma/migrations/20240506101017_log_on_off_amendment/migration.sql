/*
  Warnings:

  - The `role` column on the `Patrols` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('patrol', 'lead', 'admin');

-- AlterTable
ALTER TABLE "Patrols" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'patrol';

-- CreateTable
CREATE TABLE "LogOn" (
    "id" SERIAL NOT NULL,
    "logOnAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedHours" INTEGER NOT NULL,
    "policeStationBase" TEXT NOT NULL,
    "cpCallSign" TEXT NOT NULL,
    "logOnPatrolId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "hasLiveryOrSignage" BOOLEAN NOT NULL,
    "hasPoliceRadio" BOOLEAN NOT NULL,

    CONSTRAINT "LogOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherPatrolsInLogOn" (
    "LogOnId" INTEGER NOT NULL,
    "patrolId" INTEGER NOT NULL,

    CONSTRAINT "OtherPatrolsInLogOn_pkey" PRIMARY KEY ("LogOnId","patrolId")
);

-- CreateTable
CREATE TABLE "LogOff" (
    "id" SERIAL NOT NULL,
    "logOffAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualHours" INTEGER,
    "policeStationBase" TEXT NOT NULL,
    "cpCallSign" TEXT NOT NULL,
    "logOffPatrolId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "hasLiveryOrSignage" BOOLEAN NOT NULL,
    "hasPoliceRadio" BOOLEAN NOT NULL,
    "logOnId" INTEGER NOT NULL,

    CONSTRAINT "LogOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherPatrolsInLogOff" (
    "LogOffId" INTEGER NOT NULL,
    "patrolId" INTEGER NOT NULL,

    CONSTRAINT "OtherPatrolsInLogOff_pkey" PRIMARY KEY ("LogOffId","patrolId")
);

-- CreateTable
CREATE TABLE "Amendment" (
    "id" SERIAL NOT NULL,
    "logOffAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shiftHoursChange" INTEGER,
    "policeStationBase" TEXT,
    "cpCallSign" TEXT,
    "amendmentPatrolId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "hasLiveryOrSignage" BOOLEAN NOT NULL,
    "hasPoliceRadio" BOOLEAN NOT NULL,
    "logOnId" INTEGER NOT NULL,

    CONSTRAINT "Amendment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherPatrolsInAmendment" (
    "amendmentId" INTEGER NOT NULL,
    "patrolId" INTEGER NOT NULL,

    CONSTRAINT "OtherPatrolsInAmendment_pkey" PRIMARY KEY ("amendmentId","patrolId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogOn_id_key" ON "LogOn"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LogOff_id_key" ON "LogOff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LogOff_logOnId_key" ON "LogOff"("logOnId");

-- CreateIndex
CREATE UNIQUE INDEX "Amendment_id_key" ON "Amendment"("id");

-- AddForeignKey
ALTER TABLE "LogOn" ADD CONSTRAINT "LogOn_logOnPatrolId_fkey" FOREIGN KEY ("logOnPatrolId") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogOn" ADD CONSTRAINT "LogOn_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPatrolsInLogOn" ADD CONSTRAINT "OtherPatrolsInLogOn_LogOnId_fkey" FOREIGN KEY ("LogOnId") REFERENCES "LogOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPatrolsInLogOn" ADD CONSTRAINT "OtherPatrolsInLogOn_patrolId_fkey" FOREIGN KEY ("patrolId") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogOff" ADD CONSTRAINT "LogOff_logOffPatrolId_fkey" FOREIGN KEY ("logOffPatrolId") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogOff" ADD CONSTRAINT "LogOff_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogOff" ADD CONSTRAINT "LogOff_logOnId_fkey" FOREIGN KEY ("logOnId") REFERENCES "LogOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPatrolsInLogOff" ADD CONSTRAINT "OtherPatrolsInLogOff_LogOffId_fkey" FOREIGN KEY ("LogOffId") REFERENCES "LogOff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPatrolsInLogOff" ADD CONSTRAINT "OtherPatrolsInLogOff_patrolId_fkey" FOREIGN KEY ("patrolId") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amendment" ADD CONSTRAINT "Amendment_amendmentPatrolId_fkey" FOREIGN KEY ("amendmentPatrolId") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amendment" ADD CONSTRAINT "Amendment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amendment" ADD CONSTRAINT "Amendment_logOnId_fkey" FOREIGN KEY ("logOnId") REFERENCES "LogOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPatrolsInAmendment" ADD CONSTRAINT "OtherPatrolsInAmendment_amendmentId_fkey" FOREIGN KEY ("amendmentId") REFERENCES "Amendment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPatrolsInAmendment" ADD CONSTRAINT "OtherPatrolsInAmendment_patrolId_fkey" FOREIGN KEY ("patrolId") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
