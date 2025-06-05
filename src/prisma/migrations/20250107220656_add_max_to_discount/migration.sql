/*
  Warnings:

  - Added the required column `objetivo` to the `ORDEN_DESCUENTOS` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoDescuentoObjetivo" AS ENUM ('TOTAL_ORDEN', 'PAQUETE');

-- DropForeignKey
ALTER TABLE "DESCUENTOS" DROP CONSTRAINT "DESCUENTOS_paqueteId_fkey";

-- AlterTable
ALTER TABLE "DESCUENTOS" ADD COLUMN     "topeMaximo" DECIMAL(10,2),
ALTER COLUMN "paqueteId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ORDENES" ADD COLUMN     "notas" TEXT,
ALTER COLUMN "direccion_envio" DROP NOT NULL,
ALTER COLUMN "metodo_pago" DROP NOT NULL,
ALTER COLUMN "telefono_contacto" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ORDEN_DESCUENTOS" ADD COLUMN     "objetivo" "TipoDescuentoObjetivo" NOT NULL,
ADD COLUMN     "paqueteId" INTEGER;

-- AddForeignKey
ALTER TABLE "DESCUENTOS" ADD CONSTRAINT "DESCUENTOS_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "PAQUETES"("id") ON DELETE SET NULL ON UPDATE CASCADE;
