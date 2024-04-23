-- AlterTable
ALTER TABLE "Patrols" ALTER COLUMN "supervisorID" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "successorId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_successorId_key" ON "User"("successorId");

-- AddForeignKey
ALTER TABLE "Patrols" ADD CONSTRAINT "Patrols_supervisorID_fkey" FOREIGN KEY ("supervisorID") REFERENCES "Patrols"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_successorId_fkey" FOREIGN KEY ("successorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
