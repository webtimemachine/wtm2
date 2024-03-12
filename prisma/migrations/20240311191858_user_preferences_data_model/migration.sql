-- CreateTable
CREATE TABLE "user_preferences" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "enableNavigationEntryExpiration" BOOLEAN NOT NULL DEFAULT false,
    "navigationEntryExpirationInDays" INTEGER,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(0),

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
