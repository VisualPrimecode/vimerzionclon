/*
  Warnings:

  - You are about to drop the column `paqueteId` on the `ORDENES` table. All the data in the column will be lost.
  - Added the required column `telefono_contacto` to the `ORDENES` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ORDENES" DROP CONSTRAINT "ORDENES_paqueteId_fkey";

-- AlterTable
ALTER TABLE "ORDENES" DROP COLUMN "paqueteId",
ADD COLUMN     "telefono_contacto" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ORDEN_PAQUETES" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "paqueteId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ORDEN_PAQUETES_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ORDEN_PAQUETES" ADD CONSTRAINT "ORDEN_PAQUETES_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ORDENES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDEN_PAQUETES" ADD CONSTRAINT "ORDEN_PAQUETES_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "PAQUETES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
