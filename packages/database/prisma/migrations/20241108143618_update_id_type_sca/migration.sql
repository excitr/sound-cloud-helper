/*
  Warnings:

  - The primary key for the `sound_cloud_account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,sound_cloud_account_id]` on the table `sound_cloud_account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `sound_cloud_account` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `sound_cloud_account_user_id_sound_cloud_account_id_key` ON `sound_cloud_account`(`user_id`, `sound_cloud_account_id`);
