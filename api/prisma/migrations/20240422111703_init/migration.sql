-- CreateTable
CREATE TABLE "Patrols" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "supervisorID" INTEGER NOT NULL,

    CONSTRAINT "Patrols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" SERIAL NOT NULL,
    "numberPlate" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "patrolID" INTEGER NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reports" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "patrolID" INTEGER NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentType" (
    "incidentType" TEXT NOT NULL,
    "reportID" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "IncidentType_pkey" PRIMARY KEY ("incidentType","reportID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patrols_id_key" ON "Patrols"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patrols_email_key" ON "Patrols"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_id_key" ON "Vehicles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_numberPlate_key" ON "Vehicles"("numberPlate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_patrolID_key" ON "Vehicles"("patrolID");

-- CreateIndex
CREATE UNIQUE INDEX "Reports_id_key" ON "Reports"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reports_patrolID_key" ON "Reports"("patrolID");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentType_incidentType_key" ON "IncidentType"("incidentType");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentType_reportID_key" ON "IncidentType"("reportID");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_patrolID_fkey" FOREIGN KEY ("patrolID") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_patrolID_fkey" FOREIGN KEY ("patrolID") REFERENCES "Patrols"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentType" ADD CONSTRAINT "IncidentType_reportID_fkey" FOREIGN KEY ("reportID") REFERENCES "Reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
