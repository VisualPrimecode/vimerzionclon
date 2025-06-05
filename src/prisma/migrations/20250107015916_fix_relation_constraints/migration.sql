/*
  Warnings:

  - You are about to drop the column `usos_actuales` on the `DESCUENTOS` table. All the data in the column will be lost.
  - You are about to drop the column `paquete_id` on the `ORDENES` table. All the data in the column will be lost.
  - The `estado` column on the `ORDENES` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `duracion_horas` on the `PAQUETES` table. All the data in the column will be lost.
  - You are about to drop the column `card_number` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `id_compras` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `installments_amount` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `installments_number` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the column `response_code` on the `TRANSBANK` table. All the data in the column will be lost.
  - You are about to drop the `CATEGORIAS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DETALLE_ORDEN` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DETALLE_PAQUETES` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PRODUCTOS` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `tipo` on the `DESCUENTOS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `uso_maximo` on table `DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_inicio` on table `DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_fin` on table `DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activo` on table `DESCUENTOS` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `tipo` on the `ORDEN_DESCUENTOS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `fecha_fin` to the `PAQUETES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_inicio` to the `PAQUETES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto` to the `PAQUETES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orden_id` to the `TRANSBANK` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DETALLE_ORDEN" DROP CONSTRAINT "DETALLE_ORDEN_orden_id_fkey";

-- DropForeignKey
ALTER TABLE "DETALLE_ORDEN" DROP CONSTRAINT "DETALLE_ORDEN_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "DETALLE_PAQUETES" DROP CONSTRAINT "DETALLE_PAQUETES_paquete_id_fkey";

-- DropForeignKey
ALTER TABLE "DETALLE_PAQUETES" DROP CONSTRAINT "DETALLE_PAQUETES_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "ORDENES" DROP CONSTRAINT "ORDENES_paquete_id_fkey";

-- DropForeignKey
ALTER TABLE "PRODUCTOS" DROP CONSTRAINT "PRODUCTOS_categoria_id_fkey";

-- DropForeignKey
ALTER TABLE "TRANSBANK" DROP CONSTRAINT "TRANSBANK_id_compras_fkey";

-- AlterTable
ALTER TABLE "DESCUENTOS" DROP COLUMN "usos_actuales",
ADD COLUMN     "paquete_id" INTEGER,
ADD COLUMN     "uso_actual" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "tipo_descuento" NOT NULL,
ALTER COLUMN "uso_maximo" SET NOT NULL,
ALTER COLUMN "fecha_inicio" SET NOT NULL,
ALTER COLUMN "fecha_inicio" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "fecha_fin" SET NOT NULL,
ALTER COLUMN "fecha_fin" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "activo" SET NOT NULL;

-- AlterTable
ALTER TABLE "ORDENES" DROP COLUMN "paquete_id",
DROP COLUMN "estado",
ADD COLUMN     "estado" "estado_orden" DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "ORDEN_DESCUENTOS" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "tipo_descuento" NOT NULL;

-- AlterTable
ALTER TABLE "PAQUETES" DROP COLUMN "duracion_horas",
ADD COLUMN     "cantidad_maxima" INTEGER,
ADD COLUMN     "fecha_fin" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fecha_inicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "foto" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TRANSBANK" DROP COLUMN "card_number",
DROP COLUMN "id_compras",
DROP COLUMN "installments_amount",
DROP COLUMN "installments_number",
DROP COLUMN "response_code",
ADD COLUMN     "cardNumber" VARCHAR(20),
ADD COLUMN     "installmentsAmount" DECIMAL(10,2),
ADD COLUMN     "installmentsNumber" INTEGER,
ADD COLUMN     "orden_id" INTEGER NOT NULL,
ADD COLUMN     "responseCode" VARCHAR(5);

-- DropTable
DROP TABLE "CATEGORIAS";

-- DropTable
DROP TABLE "DETALLE_ORDEN";

-- DropTable
DROP TABLE "DETALLE_PAQUETES";

-- DropTable
DROP TABLE "PRODUCTOS";

-- CreateTable
CREATE TABLE "CATALOGO_JUEGOS" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "foto" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CATALOGO_JUEGOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SERVICIOS" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "SERVICIOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SERVICIO_FOTOS" (
    "id" SERIAL NOT NULL,
    "servicio_id" INTEGER NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SERVICIO_FOTOS_pkey" PRIMARY KEY ("id")
);

-- RenameForeignKey
ALTER TABLE "ORDENES" RENAME CONSTRAINT "ORDENES_usuario_id_fkey" TO "ORDENES_usuarios_usuario_id_fkey";

-- AddForeignKey
ALTER TABLE "ORDENES" ADD CONSTRAINT "ORDENES_paquetes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "PAQUETES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DESCUENTOS" ADD CONSTRAINT "DESCUENTOS_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "PAQUETES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TRANSBANK" ADD CONSTRAINT "TRANSBANK_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ORDENES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SERVICIO_FOTOS" ADD CONSTRAINT "SERVICIO_FOTOS_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "SERVICIOS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
