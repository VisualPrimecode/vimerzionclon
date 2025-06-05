/*
  Warnings:

  - Added the required column `plataformaId` to the `CATALOGO_JUEGOS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CATALOGO_JUEGOS" ADD COLUMN     "plataformaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PLATAFORMAS" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "PLATAFORMAS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PLATAFORMAS_nombre_key" ON "PLATAFORMAS"("nombre");

-- AddForeignKey
ALTER TABLE "CATALOGO_JUEGOS" ADD CONSTRAINT "CATALOGO_JUEGOS_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "PLATAFORMAS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
