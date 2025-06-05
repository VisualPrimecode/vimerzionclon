/*
  Warnings:

  - You are about to drop the column `direccion` on the `USUARIOS` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `USUARIOS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "USUARIOS" DROP COLUMN "direccion",
DROP COLUMN "telefono";
