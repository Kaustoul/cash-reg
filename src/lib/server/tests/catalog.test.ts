import { expect, test } from "vitest";
import { testSQLiteDb } from "./item-importer.test";
import { Catalog } from "$lib/server/till/catalog";
import Decimal from "decimal.js";
import { Price } from "$lib/server/prices/price";
import { Unit } from "$lib/server/products/product";
import { productsTable } from "../db/schema/product-model";
import { productVariantsTable } from "../db/schema/product-variant-model";

test("fetchNextProductId returns correct IDs", async () => {
    const testDb = testSQLiteDb("catalog.db");
    const db = testDb.db;

    expect(await Catalog.fetchNextProductId(db)).toBe(1);
    expect(await Catalog.insertNewProduct(db, "Test Product", new Price(new Decimal(1)), Unit.UNIT, 1)).toBe(1);
    expect(await Catalog.fetchNextProductId(db)).toBe(2);
    await Catalog.insertNewProduct(db, "Test Product", new Price(new Decimal(1)), Unit.UNIT);
    expect(await Catalog.fetchNextProductId(db)).toBe(3);

    testDb.sqlite.close();
})

test("New Product is successfully added", async () => {
    const testDb = testSQLiteDb("catalog.db");
    const db = testDb.db;

    let res = await db.select().from(productsTable);
    expect(res.length).toBe(0);
    
    await Catalog.insertNewProduct(db, "Test Product", new Price(new Decimal(1)), Unit.UNIT);
    
    res = await db.select().from(productsTable);
    expect(res.length).toBe(1);

    testDb.sqlite.close();
})

test("fetchNextItemId returns correct IDs", async () => {
    const testDb = testSQLiteDb("catalog.db");
    const db = testDb.db;
    await Catalog.insertNewProduct(db, "Test Product", new Price(new Decimal(1)), Unit.UNIT);

    expect(await Catalog.fetchNextItemId(db, 1)).toBe(1);
    await Catalog.insertNewItem(db, 1, "Test item", [0], new Decimal(10), "1234", 1);
    expect(await Catalog.fetchNextItemId(db, 1)).toBe(2);
    await Catalog.insertNewItem(db, 1, "Test item", [0], new Decimal(10), "1234", 5);
    expect(await Catalog.fetchNextItemId(db, 1)).toBe(6);
    expect(await Catalog.insertNewItem(db, 1, "Test item", [0], new Decimal(10), "1234")).toBe(6);

    testDb.sqlite.close();
})
