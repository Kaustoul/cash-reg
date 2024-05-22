import { db } from "./server/db/db";
import { productsTable } from "../../db/schema/product-model";
import type { Price } from "./structs/prices/price";
import { Unit } from "./structs/products/product";
import { ensureArray } from "./utils";

export async function insertNewProduct(name: string | null, prices: Price | Price[], unit: Unit) : Promise<number> {
    const res = await db.insert(productsTable)
        .values({
            name: name,
            prices: ensureArray(prices),
            units: unit,
        })
        .returning({newId: productsTable.productId})
        .execute()
    ;

    return res[0]['newId'];
}

export async function insertNewItem(name: string | null, prices: Price | Price[], unit: Unit) : Promise<number> {
    const res = await db.insert(productsTable)
        .values({
            name: name,
            prices: ensureArray(prices),
            units: unit,
        })
        .returning({newId: productsTable.productId})
        .execute()
    ;

    return res[0]['newId'];
}