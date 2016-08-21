DROP TABLE `purchases`;
CREATE TABLE `purchases` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `thing_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `status` enum('IMMEDIATELY','SOON','LATER','INACTIVE') DEFAULT 'LATER',
  `estimated_number_of_days` int(4) DEFAULT '7',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `purchase_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `predicted_replace_days` int(4) NOT NULL DEFAULT '7',
  PRIMARY KEY (`id`),
  KEY `foreign_key_things` (`thing_id`),
  KEY `foreign_key_users` (`user_id`),
  CONSTRAINT `foreign_key_things` FOREIGN KEY (`thing_id`) REFERENCES `things` (`id`),
  CONSTRAINT `foreign_key_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE `users`;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `full_name` varchar(255) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE `things`;
CREATE TABLE `things` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_image` varchar(1024) DEFAULT NULL,
  `barcode` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `unique_barcode` (`barcode`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
