-- CreateTable
CREATE TABLE `log_activity` (
    `id` VARCHAR(191) NOT NULL,
    `activity_type` ENUM('Follow', 'UnFollow') NOT NULL,
    `input_count` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,
    `completed_count` INTEGER NOT NULL DEFAULT 0,
    `is_success` ENUM('Success', 'UnSuccess') NULL,
    `is_status` ENUM('Y', 'N') NOT NULL,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
