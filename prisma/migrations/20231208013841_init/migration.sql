-- CreateTable
CREATE TABLE "Sample" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PhaseData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phase" INTEGER NOT NULL,
    "voltage" REAL NOT NULL,
    "current" REAL NOT NULL,
    "power" REAL NOT NULL,
    "power_r" REAL NOT NULL,
    "power_a" REAL NOT NULL,
    "power_factor" REAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    CONSTRAINT "PhaseData_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
