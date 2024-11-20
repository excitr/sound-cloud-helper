-- AlterTable
ALTER TABLE `log_activity` ADD COLUMN `cursor` INTEGER NULL,
    ADD COLUMN `last_follow_user_id` INTEGER NULL,
    MODIFY `follow_user_id` INTEGER NULL;
