/*
  Warnings:

  - A unique constraint covering the columns `[titulo]` on the table `CATEGORIAS` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CATEGORIAS_titulo_key" ON "CATEGORIAS"("titulo");
