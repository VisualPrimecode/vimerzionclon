/*
  Warnings:

  - You are about to drop the column `plataformaId` on the `CATALOGO_JUEGOS` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CATALOGO_JUEGOS" DROP CONSTRAINT "CATALOGO_JUEGOS_plataformaId_fkey";

-- AlterTable
ALTER TABLE "CATALOGO_JUEGOS" DROP COLUMN "plataformaId";

-- CreateTable
CREATE TABLE "JUEGO_PLATAFORMAS" (
    "id" SERIAL NOT NULL,
    "catalogoJuegoId" INTEGER NOT NULL,
    "plataformaId" INTEGER NOT NULL,

    CONSTRAINT "JUEGO_PLATAFORMAS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JUEGO_PLATAFORMAS_catalogoJuegoId_plataformaId_key" ON "JUEGO_PLATAFORMAS"("catalogoJuegoId", "plataformaId");

-- AddForeignKey
ALTER TABLE "JUEGO_PLATAFORMAS" ADD CONSTRAINT "JUEGO_PLATAFORMAS_catalogoJuegoId_fkey" FOREIGN KEY ("catalogoJuegoId") REFERENCES "CATALOGO_JUEGOS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JUEGO_PLATAFORMAS" ADD CONSTRAINT "JUEGO_PLATAFORMAS_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "PLATAFORMAS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
