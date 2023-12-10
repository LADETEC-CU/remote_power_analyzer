-- CreateTable
CREATE TABLE "DigitalOutput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false
);
