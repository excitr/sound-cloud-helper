/*
  Warnings:

  - Changed the type of `access_token_expire_at` on the `sound_cloud_account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `sound_cloud_account` DROP COLUMN `access_token_expire_at`,
    ADD COLUMN `access_token_expire_at` DATETIME(3) NOT NULL;
