/*
  Warnings:

  - You are about to drop the column `fecha_fin` on the `PAQUETES` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_inicio` on the `PAQUETES` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PAQUETES" DROP COLUMN "fecha_fin",
DROP COLUMN "fecha_inicio";
