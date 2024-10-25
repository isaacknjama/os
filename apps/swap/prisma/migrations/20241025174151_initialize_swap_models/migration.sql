-- CreateEnum
CREATE TYPE "SwapTransactionState" AS ENUM ('PENDING', 'PROCESSING', 'FAILED', 'COMPLETE', 'RETRY');

-- CreateTable
CREATE TABLE "MpesaOnrampSwap" (
    "id" TEXT NOT NULL,
    "state" "SwapTransactionState" NOT NULL,
    "userId" TEXT NOT NULL,
    "mpesaId" TEXT NOT NULL,
    "lightning" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MpesaOnrampSwap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntasendMpesaTransaction" (
    "id" TEXT NOT NULL,
    "state" "SwapTransactionState" NOT NULL,
    "apiRef" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "charges" TEXT NOT NULL,
    "netAmount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "IntasendMpesaTransaction_pkey" PRIMARY KEY ("id")
);
