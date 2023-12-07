/*
  Warnings:

  - Made the column `sampleId` on table `PhaseData` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PhaseData" DROP CONSTRAINT "PhaseData_sampleId_fkey";

-- AlterTable
ALTER TABLE "PhaseData" ALTER COLUMN "sampleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PhaseData" ADD CONSTRAINT "PhaseData_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
