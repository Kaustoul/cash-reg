CREATE TABLE `orders` (
	`orderid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tillid` integer NOT NULL,
	`items` text NOT NULL,
	`total` text NOT NULL,
	`paymentType` text(16) NOT NULL,
	`note` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`tillid`) REFERENCES `tills`(`tillId`) ON UPDATE no action ON DELETE no action
);
