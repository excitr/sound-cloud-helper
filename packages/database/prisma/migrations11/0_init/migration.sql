-- CreateTable
CREATE TABLE `SCH_Follow_order` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_USER` INTEGER NULL,
    `AUTH` TINYTEXT NULL,
    `ORDER_TYPE` TINYTEXT NULL,
    `ORDER_STARUS` TINYTEXT NULL,
    `ID_USER_CR_PROCESS` INTEGER NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SCH_Proxy` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Proxy_url` TINYTEXT NOT NULL,
    `Proxy_loginpass` TINYTEXT NOT NULL,
    `Cookies` TEXT NOT NULL,
    `TypeBan` TEXT NOT NULL,
    `CurrentPosition` TINYTEXT NOT NULL,
    `ZONE_NAME` TEXT NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SCH_Proxy_bk` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Proxy_url` TINYTEXT NOT NULL,
    `Proxy_loginpass` TINYTEXT NOT NULL,
    `Cookies` TEXT NOT NULL,
    `TypeBan` TEXT NOT NULL,
    `CurrentPosition` TINYTEXT NOT NULL,
    `ZONE_NAME` TEXT NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SCH_Python_order` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_USER` INTEGER NULL,
    `DETAL_JSON` TEXT NULL,
    `STATUS` TINYTEXT NULL,
    `ID_PROCESS` INTEGER NULL,
    `start_timestamp` TIMESTAMP(0) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SCH_Setting` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `key` TEXT NULL,
    `value` TEXT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `V1_Account_ban` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_account` INTEGER NULL,
    `TimeUnblock` DATETIME(0) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `V1_Follow_order` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_account` INTEGER NULL,
    `ID_user_follow` INTEGER NULL,
    `Status` TINYTEXT NULL,
    `ResponseCode` TINYTEXT NULL,
    `datatime_process` DATETIME(0) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `V1_Limit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_account` INTEGER NULL,
    `datetime` DATETIME(0) NULL,
    `amount` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `V1_Limit_UnFollow` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `id_account` INTEGER NULL,
    `datetime` DATETIME(0) NULL,
    `amount` INTEGER NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `V1_UnFollow_order` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_account` INTEGER NULL,
    `ID_user_unfollow` INTEGER NULL,
    `Status` TINYTEXT NULL,
    `ResponseCode` TINYTEXT NULL,
    `datatime_process` DATETIME(0) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `description` VARCHAR(254) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(254) NOT NULL,
    `access_token` VARCHAR(80) NULL,
    `refresh_token` VARCHAR(80) NULL,
    `ID_SC` INTEGER NULL,
    `access_token_v2` TEXT NULL,
    `access_token_v1` TEXT NULL,
    `refresh_token_v1` TEXT NULL,
    `token_expires_after_v1` DATETIME(0) NULL,
    `created_by_v1` TEXT NULL,
    `user_id` INTEGER NOT NULL,
    `token_created_at` INTEGER NULL,
    `token_expires_after` INTEGER NULL,
    `purchase_endtime` INTEGER NULL,
    `payment_active` ENUM('Y', 'N') NULL DEFAULT 'N',
    `request_token` VARCHAR(200) NULL,
    `primary` ENUM('Y', 'N') NULL DEFAULT 'N',
    `linked` ENUM('Y', 'N') NULL DEFAULT 'Y',
    `timestamp` INTEGER NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `user_id_fk_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_kind` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `desc` VARCHAR(254) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `payment_active` ENUM('Y', 'N') NOT NULL DEFAULT 'N',
    `purchase_endtime` INTEGER NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `fk_account_payment__account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_sets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `url` VARCHAR(1024) NULL,
    `todo` SMALLINT NULL DEFAULT 10,
    `follow_cnt` SMALLINT NOT NULL DEFAULT 10,
    `unfollow_cnt` SMALLINT NOT NULL DEFAULT 5,
    `pros_only` BOOLEAN NULL DEFAULT false,
    `whitelist_only` BOOLEAN NULL DEFAULT false,
    `hh` TINYINT NULL DEFAULT 10,
    `mm` TINYINT NULL DEFAULT 0,
    `process_kind_id` INTEGER NULL,
    `schedule_on` TINYINT NULL DEFAULT 0,
    `timestamp` INTEGER NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `fkas_account_id_idx`(`account_id`),
    INDEX `fkas_process_kind_id_idx`(`process_kind_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NULL,
    `t1` INTEGER NOT NULL,
    `t2` INTEGER NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cron_process` (
    `process_id` INTEGER NOT NULL,
    `locked` BOOLEAN NULL DEFAULT false,

    INDEX `fkcrp_process_id_idx`(`process_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `account_id` INTEGER NULL,
    `title` VARCHAR(254) NULL,
    `message` MEDIUMTEXT NULL,
    `codepoint` MEDIUMTEXT NULL,
    `event_kind_id` INTEGER NOT NULL,
    `timestamp` INTEGER NOT NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `id_event_idx`(`event_kind_id`),
    INDEX `zaccount_id_idx`(`account_id`),
    INDEX `zzuser_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_kind` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `title` VARCHAR(60) NOT NULL,
    `message` VARCHAR(254) NULL,
    `event_type_id` INTEGER NOT NULL,
    `to_send_mail` INTEGER NULL DEFAULT 0,
    `shielded` ENUM('Y', 'N') NULL DEFAULT 'N',
    `note` VARCHAR(80) NULL,
    `only_at_go` ENUM('Y', 'N') NULL DEFAULT 'N',

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `event_type_id_idx`(`event_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `operation_kind_id` INTEGER NOT NULL,
    `process_id` INTEGER NOT NULL,
    `operation_status_id` INTEGER NOT NULL,
    `vars` MEDIUMTEXT NULL,
    `last_try_time` INTEGER NULL,
    `fails_in_row` INTEGER NULL DEFAULT 0,

    INDEX `operation_kind_id_idx`(`operation_kind_id`),
    INDEX `operation_status_id_idx`(`operation_status_id`),
    INDEX `process_id_idx`(`process_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation_kind` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `desc` VARCHAR(240) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `desc` VARCHAR(254) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `process` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `process_kind_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,
    `process_status_id` INTEGER NOT NULL,
    `timestamp` INTEGER NULL,
    `vars` MEDIUMTEXT NULL,
    `cur_operation_id` INTEGER NULL,
    `prev_operation_id` INTEGER NULL,
    `fails_in_row` INTEGER NULL DEFAULT 0,
    `crj` TINYINT NULL,
    `created_at` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `account_id_idx`(`account_id`),
    INDEX `cur_operation_id_idx`(`cur_operation_id`),
    INDEX `process_id_idx`(`process_kind_id`),
    INDEX `process_status_id_idx`(`process_status_id`),
    INDEX `zprev_operation_id_idx`(`prev_operation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `process_kind` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `desc` VARCHAR(240) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `process_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `desc` VARCHAR(254) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(32) NULL,
    `user_id` INTEGER NULL,
    `created_at` INTEGER NULL,
    `expires_at` INTEGER NULL,
    `user_agent` VARCHAR(255) NULL,
    `jwt_mark` VARCHAR(16) NULL,
    `valid` ENUM('Y', 'N') NULL DEFAULT 'Y',

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `z1user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scheduled_process` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `process_id` INTEGER NOT NULL,
    `start_timestamp` INTEGER NOT NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `process_id_idx`(`process_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stats` (
    `account_id` INTEGER NOT NULL,
    `followed` INTEGER NULL DEFAULT 0,
    `unfollowed` INTEGER NULL DEFAULT 0,
    `time_spent` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `account_id_UNIQUE`(`account_id`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `price` FLOAT NOT NULL DEFAULT 0.00,
    `interval` ENUM('day', 'week', 'month', 'year') NOT NULL DEFAULT 'month',
    `interval_count` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_user_subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `plan_id` INTEGER NULL,
    `stripe_customer_id` VARCHAR(50) NOT NULL,
    `stripe_plan_price_id` VARCHAR(255) NULL,
    `stripe_payment_intent_id` VARCHAR(50) NOT NULL,
    `stripe_subscription_id` VARCHAR(50) NOT NULL,
    `default_payment_method` VARCHAR(255) NULL,
    `default_source` VARCHAR(255) NULL,
    `paid_amount` FLOAT NOT NULL,
    `paid_amount_currency` VARCHAR(10) NOT NULL,
    `plan_interval` VARCHAR(10) NOT NULL,
    `plan_interval_count` TINYINT NOT NULL DEFAULT 1,
    `customer_name` VARCHAR(50) NULL,
    `customer_email` VARCHAR(50) NULL,
    `plan_period_start` DATETIME(0) NULL,
    `plan_period_end` DATETIME(0) NULL,
    `created` DATETIME(0) NOT NULL,
    `status` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stripe_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscription_id` INTEGER NOT NULL DEFAULT 0,
    `first_name` VARCHAR(25) NOT NULL,
    `last_name` VARCHAR(25) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NULL,
    `phone` VARCHAR(15) NULL,
    `created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `dt` INTEGER NULL,
    `price` FLOAT NULL,
    `code` VARCHAR(45) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `time_product_id` INTEGER NOT NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `fk_time_purchase__time_product_id_idx`(`time_product_id`),
    INDEX `user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timezone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NULL,
    `alias` VARCHAR(80) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    UNIQUE INDEX `name_UNIQUE`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `touched_sc_user` (
    `user_id` INTEGER NOT NULL,
    `account_id` INTEGER NULL,
    `sc_user_id` INTEGER NOT NULL,
    `at` INTEGER NULL,
    `followed` BOOLEAN NULL DEFAULT true,
    `unfollowed` BOOLEAN NULL DEFAULT false,

    INDEX `acc_at_index`(`account_id`, `at`),
    INDEX `account_id_idx`(`account_id`),
    INDEX `idx_sc_user_id`(`sc_user_id`),
    INDEX `z_tsu_user_id_idx`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(45) NULL,
    `password` VARCHAR(60) NULL,
    `user_role_id` INTEGER NOT NULL,
    `contact_email` VARCHAR(254) NULL,
    `token` MEDIUMTEXT NULL,
    `time_left` INTEGER NULL,
    `timezone_id` INTEGER NULL,
    `stamp` VARCHAR(16) NULL,
    `refresh_token` VARCHAR(16) NULL,
    `token_expires_after` INTEGER NULL,
    `purchase_endtime` INTEGER NULL,
    `payment_active` ENUM('Y', 'N') NULL DEFAULT 'N',
    `request_token` VARCHAR(200) NULL,
    `jwt_version` INTEGER NULL DEFAULT 0,
    `modpass_key` VARCHAR(64) NULL,
    `modpass_exp` INTEGER NULL,
    `modpass_todo` ENUM('Y', 'N') NULL DEFAULT 'N',
    `modpass_hash` VARCHAR(60) NULL,
    `use_shared_db` ENUM('Y', 'N') NULL DEFAULT 'N',
    `last_account_id` INTEGER NULL,
    `forgotpass_hash` VARCHAR(60) NULL,
    `forgotpass_exp` INTEGER NULL,
    `forgotpass_todo` ENUM('Y', 'N') NOT NULL DEFAULT 'N',
    `specific_user` ENUM('Y', 'N') NOT NULL DEFAULT 'N',

    UNIQUE INDEX `request_token_UNIQUE`(`request_token`),
    INDEX `timezone_id_idx`(`timezone_id`),
    INDEX `user_role_id_idx`(`user_role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `payment_active` ENUM('Y', 'N') NULL DEFAULT 'N',
    `purchase_endtime` INTEGER NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `fk_user_payment__user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `desc` VARCHAR(254) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account_payment` ADD CONSTRAINT `fk_account_payment__account_id` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account_sets` ADD CONSTRAINT `fkas_account_id` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account_sets` ADD CONSTRAINT `fkas_process_kind_id` FOREIGN KEY (`process_kind_id`) REFERENCES `process_kind`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cron_process` ADD CONSTRAINT `fkcrp_process_id` FOREIGN KEY (`process_id`) REFERENCES `process`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_id` FOREIGN KEY (`event_kind_id`) REFERENCES `event_kind`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `zaccount_id` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `zzuser_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_kind` ADD CONSTRAINT `event_type_id` FOREIGN KEY (`event_type_id`) REFERENCES `event_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `operation` ADD CONSTRAINT `operation_kind_id` FOREIGN KEY (`operation_kind_id`) REFERENCES `operation_kind`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `operation` ADD CONSTRAINT `operation_status_id` FOREIGN KEY (`operation_status_id`) REFERENCES `operation_status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `operation` ADD CONSTRAINT `process_id` FOREIGN KEY (`process_id`) REFERENCES `process`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `account_id` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `cur_operation_id` FOREIGN KEY (`cur_operation_id`) REFERENCES `operation`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `process_kind` FOREIGN KEY (`process_kind_id`) REFERENCES `process_kind`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `process_status_id` FOREIGN KEY (`process_status_id`) REFERENCES `process_status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `zprev_operation_id` FOREIGN KEY (`prev_operation_id`) REFERENCES `operation`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `z1user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `scheduled_process` ADD CONSTRAINT `zprocess_id` FOREIGN KEY (`process_id`) REFERENCES `process`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `touched_sc_user` ADD CONSTRAINT `z2_account_id` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `timezone_id` FOREIGN KEY (`timezone_id`) REFERENCES `timezone`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id` FOREIGN KEY (`user_role_id`) REFERENCES `user_role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_payment` ADD CONSTRAINT `fk_user_payment__user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

