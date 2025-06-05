/*
  Warnings:

  - You are about to drop the column `foto` on the `CATALOGO_JUEGOS` table. All the data in the column will be lost.
  - Added the required column `foto` to the `JUEGO_PLATAFORMAS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CATALOGO_JUEGOS" DROP COLUMN "foto";

-- AlterTable
ALTER TABLE "JUEGO_PLATAFORMAS" ADD COLUMN     "foto" TEXT NOT NULL;
