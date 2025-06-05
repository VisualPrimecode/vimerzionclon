/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `TRANSBANK` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TRANSBANK_token_key" ON "TRANSBANK"("token");
