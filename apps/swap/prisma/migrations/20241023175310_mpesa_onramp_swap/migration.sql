-- CreateEnum
CREATE TYPE "MpesaOnrampSwapState" AS ENUM ('PENDING', 'PROCESSING', 'FAILED', 'COMPLETE');

-- CreateTable
CREATE TABLE "MpesaOnrampSwap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "lightning" TEXT NOT NULL,
    "mpesa" TEXT NOT NULL,
    "state" "MpesaOnrampSwapState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MpesaOnrampSwap_pkey" PRIMARY KEY ("id")
);
