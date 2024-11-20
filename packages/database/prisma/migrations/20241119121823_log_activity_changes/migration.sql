/*
  Warnings:

  - You are about to drop the column `next_href` on the `log_activity` table. All the data in the column will be lost.
  - The values [UnSuccess] on the enum `log_activity_is_success` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `log_activity` DROP COLUMN `next_href`,
    MODIFY `is_success` ENUM('Success', 'Failure') NULL,
    ALTER COLUMN `start_time` DROP DEFAULT,
    ALTER COLUMN `end_time` DROP DEFAULT;
