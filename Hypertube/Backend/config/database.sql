CREATE DATABASE IF NOT EXISTS `hypertube`;
USE `hypertube`;
CREATE TABLE `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `language` TINYINT(1) DEFAULT 0,
    `picture` VARCHAR(24),
    `activationCode` VARCHAR(18) DEFAULT NULL,
    `activated` TINYINT(1) DEFAULT 0,
    `42` VARCHAR(100),
    `github` VARCHAR(100),
    `gitlab` VARCHAR(100),
    `google` VARCHAR(100),
    PRIMARY KEY (`id`)
);

CREATE TABLE `movie` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(100) NOT NULL UNIQUE,
    `imdb` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `visit` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `hash` VARCHAR(100) NOT NULL,
    `imdb` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `lastVisit` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`username`) REFERENCES `user`(`username`),
    FOREIGN KEY (`hash`) REFERENCES `movie`(`hash`)
);

CREATE TABLE `comment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `imdb` VARCHAR(100) NOT NULL,
    `value` TEXT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`username`) REFERENCES `user`(`username`)
);
