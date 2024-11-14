/*
  Warnings:

  - Added the required column `next_href` to the `log_activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log_activity` ADD COLUMN `next_href` VARCHAR(191) NOT NULL;
