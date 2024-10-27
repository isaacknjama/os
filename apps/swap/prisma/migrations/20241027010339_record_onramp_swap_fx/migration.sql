/*
  Warnings:

  - Added the required column `rate` to the `MpesaOnrampSwap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MpesaOnrampSwap" ADD COLUMN     "rate" TEXT NOT NULL;
