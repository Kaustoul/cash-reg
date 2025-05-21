CREATE TABLE IF NOT EXISTS `products` (
	`productid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`prices` text NOT NULL,
	`units` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`modifiedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `items` (
	`itemid` integer DEFAULT (0) NOT NULL,
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
CREATE TABLE IF NOT EXISTS `tills` (
	`tillId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`balance` text NOT NULL,
	`note` text(256),
	`status` text(16) DEFAULT 'closed' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `customers` (
	`customerId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`surname` text(256) NOT NULL,
	`email` text(256),
	`balance` text NOT NULL,
	`discount` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`modifiedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `customer_payments` (
	`paymentId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customerId` integer NOT NULL,
	`transactionId` integer NOT NULL,
	`orderId` integer,
	`amount` text NOT NULL,
	`type` text(16) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`customerId`) REFERENCES `customers`(`customerId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transactionId`) REFERENCES `money_transfers`(`transactionId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `money_transfers` (
	`transactionId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tillId` integer NOT NULL,
	`moneySums` text NOT NULL,
	`cashierId` integer,
	`type` text(16) DEFAULT 'unknown' NOT NULL,
	`reason` text(32) NOT NULL,
	`note` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`tillId`) REFERENCES `tills`(`tillId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `orders` (
	`orderid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tillid` integer NOT NULL,
	`items` text NOT NULL,
	`discounts` text,
	`total` text NOT NULL,
	`paymentType` text(16) NOT NULL,
	`note` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`customerId` integer,
	`transactionId` integer DEFAULT 'null',
	FOREIGN KEY (`tillid`) REFERENCES `tills`(`tillId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transactionId`) REFERENCES `money_transfers`(`transactionId`) ON UPDATE no action ON DELETE no action
);
