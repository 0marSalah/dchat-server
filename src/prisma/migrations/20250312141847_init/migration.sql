/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- CreateTable
CREATE TABLE "keypair" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "public" TEXT NOT NULL,
    "private" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keypair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keypair_userId_key" ON "keypair"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "keypair_public_key" ON "keypair"("public");

-- CreateIndex
CREATE UNIQUE INDEX "keypair_private_key" ON "keypair"("private");

-- AddForeignKey
ALTER TABLE "keypair" ADD CONSTRAINT "keypair_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
