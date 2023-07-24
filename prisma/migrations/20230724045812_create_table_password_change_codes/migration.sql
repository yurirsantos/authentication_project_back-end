-- CreateTable
CREATE TABLE "PasswordChangeCodes" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordChangeCodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PasswordChangeCodes" ADD CONSTRAINT "PasswordChangeCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
