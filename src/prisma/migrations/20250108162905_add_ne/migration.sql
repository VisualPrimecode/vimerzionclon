/*
  Warnings:

  - You are about to drop the `CATALOGO_JUEGOS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CATEGORIAS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JUEGO_PLATAFORMAS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PLATAFORMAS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SERVICIOS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SERVICIO_FOTOS` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TECNOLOGIAS` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CATALOGO_JUEGOS" DROP CONSTRAINT "CATALOGO_JUEGOS_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "JUEGO_PLATAFORMAS" DROP CONSTRAINT "JUEGO_PLATAFORMAS_catalogoJuegoId_fkey";

-- DropForeignKey
ALTER TABLE "JUEGO_PLATAFORMAS" DROP CONSTRAINT "JUEGO_PLATAFORMAS_plataformaId_fkey";

-- DropForeignKey
ALTER TABLE "SERVICIO_FOTOS" DROP CONSTRAINT "SERVICIO_FOTOS_servicio_id_fkey";

-- DropTable
DROP TABLE "CATALOGO_JUEGOS";

-- DropTable
DROP TABLE "CATEGORIAS";

-- DropTable
DROP TABLE "JUEGO_PLATAFORMAS";

-- DropTable
DROP TABLE "PLATAFORMAS";

-- DropTable
DROP TABLE "SERVICIOS";

-- DropTable
DROP TABLE "SERVICIO_FOTOS";

-- DropTable
DROP TABLE "TECNOLOGIAS";

-- DropEnum
DROP TYPE "EstadoProducto";
