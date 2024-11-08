/*
  Warnings:

  - Added the required column `access_token_expire_at` to the `sound_cloud_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sound_cloud_account` ADD COLUMN `access_token_expire_at` INTEGER NOT NULL;
