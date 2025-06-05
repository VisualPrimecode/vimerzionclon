/*
  Warnings:

  - You are about to drop the column `created_at` on the `CATALOGO_JUEGOS` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `CATALOGO_JUEGOS` table. All the data in the column will be lost.
  - You are about to drop the column `paquete_id` on the `DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `ORDENES` table. All the data in the column will be lost.
  - The `estado` column on the `ORDENES` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `descuento_id` on the `ORDEN_DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `orden_id` on the `ORDEN_DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `payment_type_code` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `rol_id` on the `USUARIOS` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `CATALOGO_JUEGOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paqueteId` to the `DESCUENTOS` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `tipo` on the `DESCUENTOS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `usuarioId` to the `ORDENES` table without a default value. This is not possible if the table is not empty.
  - Made the column `fecha` on table `ORDENES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descuento_total` on table `ORDENES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metodo_pago` on table `ORDENES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `ORDENES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `ORDENES` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `descuentoId` to the `ORDEN_DESCUENTOS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordenId` to the `ORDEN_DESCUENTOS` table without a default value. This is not possible if the table is not empty.
  - Made the column `monto_aplicado` on table `ORDEN_DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_aplicacion` on table `ORDEN_DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `tipo` on the `ORDEN_DESCUENTOS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `created_at` on table `PAQUETES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `PAQUETES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `ROLES` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha` on table `TRANSBANK` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activo` on table `USUARIOS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `USUARIOS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `USUARIOS` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO', 'ENVIADO');

-- CreateEnum
CREATE TYPE "EstadoProducto" AS ENUM ('ACTIVO', 'INACTIVO', 'DESCONTINUADO');

-- CreateEnum
CREATE TYPE "TipoDescuento" AS ENUM ('PORCENTAJE', 'MONTO_FIJO');

-- DropForeignKey
ALTER TABLE "DESCUENTOS" DROP CONSTRAINT "DESCUENTOS_paquete_id_fkey";

-- DropForeignKey
ALTER TABLE "ORDENES" DROP CONSTRAINT "ORDENES_paquetes_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "ORDENES" DROP CONSTRAINT "ORDENES_usuarios_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" DROP CONSTRAINT "ORDEN_DESCUENTOS_descuento_id_fkey";

-- DropForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" DROP CONSTRAINT "ORDEN_DESCUENTOS_orden_id_fkey";

-- DropForeignKey
ALTER TABLE "SERVICIO_FOTOS" DROP CONSTRAINT "SERVICIO_FOTOS_servicio_id_fkey";

-- DropForeignKey
ALTER TABLE "TRANSBANK" DROP CONSTRAINT "TRANSBANK_orden_id_fkey";

-- DropForeignKey
ALTER TABLE "USUARIOS" DROP CONSTRAINT "USUARIOS_rol_id_fkey";

-- AlterTable
ALTER TABLE "CATALOGO_JUEGOS" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "categoriaId" INTEGER NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DESCUENTOS" DROP COLUMN "paquete_id",
ADD COLUMN     "paqueteId" INTEGER NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoDescuento" NOT NULL;

-- AlterTable
ALTER TABLE "ORDENES" DROP COLUMN "usuario_id",
ADD COLUMN     "paqueteId" INTEGER,
ADD COLUMN     "usuarioId" INTEGER NOT NULL,
ALTER COLUMN "fecha" SET NOT NULL,
ALTER COLUMN "fecha" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "descuento_total" SET NOT NULL,
ALTER COLUMN "metodo_pago" SET NOT NULL,
ALTER COLUMN "metodo_pago" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "ORDEN_DESCUENTOS" DROP COLUMN "descuento_id",
DROP COLUMN "orden_id",
ADD COLUMN     "descuentoId" INTEGER NOT NULL,
ADD COLUMN     "ordenId" INTEGER NOT NULL,
ALTER COLUMN "monto_aplicado" SET NOT NULL,
ALTER COLUMN "fecha_aplicacion" SET NOT NULL,
ALTER COLUMN "fecha_aplicacion" SET DATA TYPE TIMESTAMP(3),
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoDescuento" NOT NULL;

-- AlterTable
ALTER TABLE "PAQUETES" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ROLES" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SERVICIOS" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SERVICIO_FOTOS" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TRANSBANK" DROP COLUMN "payment_type_code",
ADD COLUMN     "paymentTypeCode" VARCHAR(5),
ALTER COLUMN "fecha" SET NOT NULL,
ALTER COLUMN "fecha" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "authorization_code" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "USUARIOS" DROP COLUMN "rol_id",
ADD COLUMN     "rolId" INTEGER,
ALTER COLUMN "activo" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- DropEnum
DROP TYPE "estado_orden";

-- DropEnum
DROP TYPE "estado_producto";

-- DropEnum
DROP TYPE "tipo_descuento";

-- CreateTable
CREATE TABLE "CATEGORIAS" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "CATEGORIAS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TECNOLOGIAS" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto" TEXT,

    CONSTRAINT "TECNOLOGIAS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "USUARIOS" ADD CONSTRAINT "USUARIOS_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "ROLES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CATALOGO_JUEGOS" ADD CONSTRAINT "CATALOGO_JUEGOS_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CATEGORIAS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDENES" ADD CONSTRAINT "ORDENES_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "USUARIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDENES" ADD CONSTRAINT "ORDENES_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "PAQUETES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DESCUENTOS" ADD CONSTRAINT "DESCUENTOS_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "PAQUETES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" ADD CONSTRAINT "ORDEN_DESCUENTOS_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ORDENES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" ADD CONSTRAINT "ORDEN_DESCUENTOS_descuentoId_fkey" FOREIGN KEY ("descuentoId") REFERENCES "DESCUENTOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TRANSBANK" ADD CONSTRAINT "TRANSBANK_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ORDENES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SERVICIO_FOTOS" ADD CONSTRAINT "SERVICIO_FOTOS_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "SERVICIOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
