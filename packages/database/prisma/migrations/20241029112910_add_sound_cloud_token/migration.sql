/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `soundcloudtoken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `soundcloudtoken` DROP COLUMN `refreshToken`,
    ADD COLUMN `refresh_token` VARCHAR(16) NULL,
    MODIFY `expiresIn` VARCHAR(16) NULL;
