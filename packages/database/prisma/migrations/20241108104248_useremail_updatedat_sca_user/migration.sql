/*
  Warnings:

  - Made the column `contact_email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `contact_email` VARCHAR(254) NOT NULL;
