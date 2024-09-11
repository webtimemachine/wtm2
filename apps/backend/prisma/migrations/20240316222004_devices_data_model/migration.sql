-- CleanTable
DELETE FROM "navigation_entry";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- AlterTable
ALTER TABLE "navigation_entry" DROP COLUMN "userAgent",
ADD COLUMN     "userDeviceId" BIGINT NOT NULL;

-- DropTable
DROP TABLE "sessions";

-- CreateTable
CREATE TABLE "device" (
    "id" BIGSERIAL NOT NULL,
    "deviceKey" VARCHAR NOT NULL,
    "userAgent" VARCHAR,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(0),

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_device" (
    "id" BIGSERIAL NOT NULL,
    "deviceAlias" VARCHAR,
    "userId" BIGINT NOT NULL,
    "deviceId" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(0),

    CONSTRAINT "user_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" BIGSERIAL NOT NULL,
    "refreshToken" VARCHAR NOT NULL,
    "userDeviceId" BIGINT NOT NULL,
    "expiration" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(0),

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_deviceKey_key" ON "device"("deviceKey");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_userId_deviceId_key" ON "user_device"("userId", "deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "session_userDeviceId_key" ON "session"("userDeviceId");

-- AddForeignKey
ALTER TABLE "user_device" ADD CONSTRAINT "user_device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_device" ADD CONSTRAINT "user_device_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userDeviceId_fkey" FOREIGN KEY ("userDeviceId") REFERENCES "user_device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_entry" ADD CONSTRAINT "navigation_entry_userDeviceId_fkey" FOREIGN KEY ("userDeviceId") REFERENCES "user_device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
