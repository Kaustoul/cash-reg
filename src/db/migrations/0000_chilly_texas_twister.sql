CREATE TABLE `products` (
	`productid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`prices` text NOT NULL,
	`units` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`itemid` integer NOT NULL,
	`productid` integer NOT NULL,
	`name` text(256) NOT NULL,
	`priceIdxs` text NOT NULL,
	`itemDiscountIdxs` text NOT NULL,
	`stock` text,
	`ean` text(128),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`modifiedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`itemid`, `productid`),
	FOREIGN KEY (`productid`) REFERENCES `products`(`productid`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `tills` (
	`tillId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`balance` text NOT NULL,
	`note` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `money_transfers` (
	`transferId` integer DEFAULT (newid()) NOT NULL,
	`tillId` integer NOT NULL,
	`moneySums` text NOT NULL,
	`transactionId` integer,
	`cashierId` integer,
	`note` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`tillId`, `transactionId`),
	FOREIGN KEY (`tillId`) REFERENCES `tills`(`tillId`) ON UPDATE no action ON DELETE no action
);
