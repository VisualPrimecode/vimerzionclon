/*
  Warnings:

  - You are about to drop the column `cantidad_maxima` on the `PAQUETES` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PAQUETES" DROP COLUMN "cantidad_maxima",
ADD COLUMN     "sotck_paquete" INTEGER;
