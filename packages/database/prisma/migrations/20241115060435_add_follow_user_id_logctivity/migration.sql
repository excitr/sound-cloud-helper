/*
  Warnings:

  - Added the required column `follow_user_id` to the `log_activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log_activity` ADD COLUMN `follow_user_id` INTEGER NOT NULL;
