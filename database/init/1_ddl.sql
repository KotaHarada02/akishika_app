CREATE TABLE `AKISHIKA` (
	`AKISHIKA_ID` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`AKISHIKA_NAME` VARCHAR(255) NOT NULL,
	`SAKE_TYPE` VARCHAR(10) NOT NULL,
	`ALCOHOL_CONTENT` TINYINT unsigned,
	`GLASS_QUANTITY` INT unsigned DEFAULT 120,
	`GLASS_PRICE` INT unsigned NOT NULL,
	`NIGO_PRICE` INT unsigned,
	`FEATURE` TEXT NOT NULL,
	`STOCK` TINYINT(1) NOT NULL DEFAULT 0 CHECK (`STOCK` IN (0,1)),
	`IMAGE` VARCHAR(50) NOT NULL,
	UNIQUE (`AKISHIKA_NAME`)
);