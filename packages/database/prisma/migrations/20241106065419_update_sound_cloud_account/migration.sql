/*
  Warnings:

  - You are about to drop the column `token_created_at` on the `sound_cloud_account` table. All the data in the column will be lost.
  - You are about to drop the column `token_updated_at` on the `sound_cloud_account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sound_cloud_account` DROP COLUMN `token_created_at`,
    DROP COLUMN `token_updated_at`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
