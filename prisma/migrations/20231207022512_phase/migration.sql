/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Sample" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhaseData" (
    "id" SERIAL NOT NULL,
    "phase" INTEGER NOT NULL,
    "voltage" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL,
    "power" DOUBLE PRECISION NOT NULL,
    "power_r" DOUBLE PRECISION NOT NULL,
    "power_a" DOUBLE PRECISION NOT NULL,
    "power_factor" DOUBLE PRECISION NOT NULL,
    "sampleId" INTEGER,

    CONSTRAINT "PhaseData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhaseData" ADD CONSTRAINT "PhaseData_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE SET NULL ON UPDATE CASCADE;
