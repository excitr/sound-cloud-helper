-- AlterTable
ALTER TABLE `log_activity` MODIFY `follow_user_id` VARCHAR(191) NULL,
    MODIFY `cursor` VARCHAR(191) NULL,
    MODIFY `last_follow_user_id` VARCHAR(191) NULL;
