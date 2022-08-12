create database if not exists `staff-share`;

use `staff-share`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` VARCHAR(50) UNIQUE NOT NULl,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(60) UNIQUE NOT NULL,
    `validated` BIT DEFAULT 0,
    `auth_provider` VARCHAR(50) UNIQUE,
    PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `sheet`;

CREATE TABLE `sheet` (
  `id` char(36) NOT NULL,
  `title` varchar(45) NOT NULL,
  `subtitle` varchar(45) DEFAULT NULL,
  `composer` varchar(45) DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  `keySignature` varchar(45) DEFAULT NULL,
  `data_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `audio`;
CREATE TABLE `audio` (
  `id` char(36) NOT NULL,
  `part_name` varchar(45) NOT NULL,
  `data_path` varchar(45) NOT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  `sheet_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sheet_id` (`sheet_id`),
  CONSTRAINT `audio_ibfk_1` FOREIGN KEY (`sheet_id`) REFERENCES `sheet` (`id`) ON DELETE CASCADE
);


DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` char(36) NOT NULL,
  `sheet_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);


DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `id` char(36) NOT NULL,
  `sheet_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sheet_id` (`sheet_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`sheet_id`) REFERENCES `sheet` (`id`) ON DELETE CASCADE
);