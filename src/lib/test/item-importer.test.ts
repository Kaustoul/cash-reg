import { expect, test } from "vitest";
import { testCsvData, testItemsCSVPath } from "./csv-reader.test";
import { Catalog } from "$lib/structs/till/catalog";
import { importItemsAndProductsFromCSV } from "$lib/item-importer";
import Database from "better-sqlite3";
import path from 'path'
import fs from 'fs';
import { drizzle } from "drizzle-orm/better-sqlite3";
import { CashRegisterError } from "$lib/errors/cash-register-error";
import { defaultSchema } from "../../db";

export function testSQLiteDb(filename: string = 'test.db', keepfile: boolean = false) {
    const dbPath = path.join('src', 'lib', 'test', 'data', 'db', filename)
    // if file exists, delete it
    if (!keepfile && fs.existsSync(dbPath)) {
        try {
            fs.unlinkSync(dbPath)
        } catch (err) {
            throw new CashRegisterError(`Failed to delete test db: ${err}`);
        }
    }

    const sqlite = new Database(dbPath);
    const db = drizzle(sqlite);
    defaultSchema(db);

    return {db: db, sqlite: sqlite};
}

test('importItemsAndProductsFromCSV', async () => {
    const filePath = "path/to/valid/csv/file.csv";
    const csvData = testCsvData();
    const catalog = Catalog.getInstance();

    const testDb = testSQLiteDb("items.db", true)
    await importItemsAndProductsFromCSV(testItemsCSVPath(), testDb.db);
    testDb.sqlite.close();
});
