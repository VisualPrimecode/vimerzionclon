/*
  Warnings:

  - The values [PENDIENTE,PAGADO,ENVIADO] on the enum `EstadoOrden` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paqueteId` on the `DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `topeMaximo` on the `DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `ORDENES` table. All the data in the column will be lost.
  - You are about to drop the column `descuentoId` on the `ORDEN_DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `ordenId` on the `ORDEN_DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `paqueteId` on the `ORDEN_DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `ordenId` on the `ORDEN_PAQUETES` table. All the data in the column will be lost.
  - You are about to drop the column `paqueteId` on the `ORDEN_PAQUETES` table. All the data in the column will be lost.
  - You are about to drop the column `precioUnitario` on the `ORDEN_PAQUETES` table. All the data in the column will be lost.
  - You are about to drop the column `authorization_code` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `cardNumber` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `installmentsAmount` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `installmentsNumber` on the `TRANSBANK` table. All the data in the column will be lost.
  - Added the required column `usuario_id` to the `ORDENES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descuento_id` to the `ORDEN_DESCUENTOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orden_id` to the `ORDEN_DESCUENTOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orden_id` to the `ORDEN_PAQUETES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paquete_id` to the `ORDEN_PAQUETES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_unitario` to the `ORDEN_PAQUETES` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO');

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoOrden_new" AS ENUM ('CREADO', 'CANCELADO', 'EN_PROCESO', 'EN_CAMINO', 'ENTREGADO');
ALTER TABLE "ORDENES" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "ORDENES" ALTER COLUMN "estado" TYPE "EstadoOrden_new" USING ("estado"::text::"EstadoOrden_new");
ALTER TYPE "EstadoOrden" RENAME TO "EstadoOrden_old";
ALTER TYPE "EstadoOrden_new" RENAME TO "EstadoOrden";
DROP TYPE "EstadoOrden_old";
ALTER TABLE "ORDENES" ALTER COLUMN "estado" SET DEFAULT 'CREADO';
COMMIT;

-- DropForeignKey
ALTER TABLE "DESCUENTOS" DROP CONSTRAINT "DESCUENTOS_paqueteId_fkey";

-- DropForeignKey
ALTER TABLE "ORDENES" DROP CONSTRAINT "ORDENES_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" DROP CONSTRAINT "ORDEN_DESCUENTOS_descuentoId_fkey";

-- DropForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" DROP CONSTRAINT "ORDEN_DESCUENTOS_ordenId_fkey";

-- DropForeignKey
ALTER TABLE "ORDEN_PAQUETES" DROP CONSTRAINT "ORDEN_PAQUETES_ordenId_fkey";

-- DropForeignKey
ALTER TABLE "ORDEN_PAQUETES" DROP CONSTRAINT "ORDEN_PAQUETES_paqueteId_fkey";

-- AlterTable
ALTER TABLE "DESCUENTOS" DROP COLUMN "paqueteId",
DROP COLUMN "topeMaximo",
ADD COLUMN     "paquete_id" INTEGER,
ADD COLUMN     "tope_maximo" DECIMAL(10,2),
ALTER COLUMN "codigo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ORDENES" DROP COLUMN "usuarioId",
ADD COLUMN     "usuario_id" INTEGER NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'CREADO';

-- AlterTable
ALTER TABLE "ORDEN_DESCUENTOS" DROP COLUMN "descuentoId",
DROP COLUMN "ordenId",
DROP COLUMN "paqueteId",
ADD COLUMN     "descuento_id" INTEGER NOT NULL,
ADD COLUMN     "orden_id" INTEGER NOT NULL,
ADD COLUMN     "paquete_id" INTEGER;

-- AlterTable
ALTER TABLE "ORDEN_PAQUETES" DROP COLUMN "ordenId",
DROP COLUMN "paqueteId",
DROP COLUMN "precioUnitario",
ADD COLUMN     "orden_id" INTEGER NOT NULL,
ADD COLUMN     "paquete_id" INTEGER NOT NULL,
ADD COLUMN     "precio_unitario" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "PAQUETES" ALTER COLUMN "nombre" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ROLES" ALTER COLUMN "nombre" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TRANSBANK" DROP COLUMN "authorization_code",
DROP COLUMN "cardNumber",
DROP COLUMN "installmentsAmount",
DROP COLUMN "installmentsNumber",
ADD COLUMN     "authorizationCode" TEXT,
ADD COLUMN     "card_number" TEXT,
ADD COLUMN     "estado_pago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "installments_amount" DECIMAL(10,2),
ADD COLUMN     "installments_number" INTEGER,
ALTER COLUMN "session_id" SET DATA TYPE TEXT,
ALTER COLUMN "token" SET DATA TYPE TEXT,
ALTER COLUMN "responseCode" SET DATA TYPE TEXT,
ALTER COLUMN "paymentTypeCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "USUARIOS" ALTER COLUMN "username" SET DATA TYPE TEXT,
ALTER COLUMN "hashed_password" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "telefono" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ORDENES" ADD CONSTRAINT "ORDENES_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDEN_PAQUETES" ADD CONSTRAINT "ORDEN_PAQUETES_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ORDENES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDEN_PAQUETES" ADD CONSTRAINT "ORDEN_PAQUETES_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "PAQUETES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DESCUENTOS" ADD CONSTRAINT "DESCUENTOS_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "PAQUETES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" ADD CONSTRAINT "ORDEN_DESCUENTOS_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ORDENES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" ADD CONSTRAINT "ORDEN_DESCUENTOS_descuento_id_fkey" FOREIGN KEY ("descuento_id") REFERENCES "DESCUENTOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
