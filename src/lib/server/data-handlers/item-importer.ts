import Decimal from "decimal.js";
import { parseCSV } from "./csv-reader";
import { Price } from "$lib/shared/prices/price";
import { Unit } from "../products/product";
import { CashRegisterError } from "$lib/shared/errors/cash-register-error";
import { Catalog } from "../till/catalog";
import { database, db, type Databases } from "../db/db";
import { CurrencyManager } from "$lib/shared/prices/currency-manager";
import type { IPrice } from "$lib/shared/interfaces/price";

export async function importItemsAndProductsFromCSV(
    rawCSV: string,
    database: any = db
): Promise<number> {
    const csvData = parseCSV(rawCSV);
    // filter lines with product id to the front.
    //
    //const lines = csvData.filter(line => 
    //    line[0] !== null).concat(csvData.filter(line => line[0] === null)
    //);
    
    const lines = csvData;

    let productId: number | undefined;
    let itemId: number | undefined;
    let name: string | null;
    let subname: string;
    let price: Price | undefined;
    let stock: Decimal | undefined;
    let unit: Unit;
    let ean: string | null;

    let currentProductId: number | undefined;
    let currentPrice: Price
    let lastItemId: number | undefined;

    let count = 0;

    for (const line of lines) {
        console.log("Reading line: " + line.join(", "));
        // productId
        const productIdStr = line[0];
        if (productIdStr !== null) {   
            productId = Number.parseInt(productIdStr.trim());
            if (Number.isNaN(productId)) {
                throw new CashRegisterError("Invalid product ID: " + productIdStr);
            }
            
            if (Catalog.containsProduct(productId)) {
                throw new CashRegisterError("Product with ID " + productId + " already exists in the catalog.");
            }
        }

        // name
        name = line[1]

        // itemId
        const itemIdStr = line[2];
        if (itemIdStr !== null) {   
            itemId = Number.parseInt(itemIdStr.trim());
            if (Number.isNaN(itemId)) {
                throw new CashRegisterError("Invalid item ID: " + productIdStr);
            }
            
            if (productId !== undefined && Catalog.containsItem(productId, itemId)) {
                throw new CashRegisterError("Item with ID " + productId + " already exists in the catalog.");
            }
        } else {
            itemId = undefined;
        }

        console.log("itemId: ", itemId);

        // Subname
        if (line[3] == null) {
            throw new CashRegisterError("Missing name for item");
        }
        subname = line[3].trim();

        // Price
        const priceStr = line[4];
        if (priceStr === null) {
            if (itemId === undefined || itemId === 1) {
                throw new CashRegisterError("Missing Price value for item : '" + subname +"'.");
            }

            price = currentPrice!;
        } else {
            let priceVal = new Decimal(priceStr.trim());
   
            if (Decimal.isDecimal(priceVal) === false) {
                throw new CashRegisterError("Invalid Price value for item : '" + subname +"'.");
            }
            
            price = new Price(priceVal);
        }
        

        // Stock
        const stockStr = line[5];
        if (stockStr === null) {
            stock = undefined;
        } else {
            stock = new Decimal(stockStr.trim());

            if (!Decimal.isDecimal(stock)) {
                throw new CashRegisterError("Invalid Stock value for item : '" + subname +"'.");
            }
        }
        // Units
        let unitStr = line[6];
        unit = unitStr !== null ? Unit[unitStr.trim().toUpperCase() as keyof typeof Unit] : Unit.UNIT;
        // Ean
        ean = line[7];

        if (ean !== null && ean !== undefined)
            ean = ean.trim();

        if (itemId === undefined || itemId === 1) {
            console.log("Inserting product: " + name + " with ID: " + productId + ".")
            currentProductId = await Catalog.insertNewProduct(database, name, price, unit, productId);
        }

        if (itemId === 1) {
            currentPrice = price;
        }

        if (currentProductId === undefined) {
            if (productId !== undefined) {    
                currentProductId = productId;
            } else {
                throw new CashRegisterError("Missing product ID for item : '" + subname +"'.");
            }
        }
        
        console.log("Inserting item: " + subname + " with ID: " + itemId + " and product ID: " + currentProductId + ".")

        await Catalog.insertNewItem(
            database,
            currentProductId,
            subname,
            [0],
            stock,
            ean === null ? undefined : ean,
            itemId === undefined ? 1 : itemId
        );
        
        console.log("Inserted item: " + subname + " with ID: " + itemId + " and product ID: " + currentProductId + ".")

        lastItemId = itemId;
        count++;
    }

    return count;
}


export async function csvImporter(
    rawCSV: string,
    db = database
): Promise<number> {
    const csvData = parseCSV(rawCSV);
    console.log(csvData);
    // filter lines with product id to the front.
    //
    //const lines = csvData.filter(line => 
    //    line[0] !== null).concat(csvData.filter(line => line[0] === null)
    //);
    
    const lines = csvData;

    let itemId: number | undefined;
    let name: string | null;
    let subname: string;
    let price: IPrice | undefined;
    let stock: string | null;
    let unit: Unit;
    let ean: string | null;

    let currentProductId: number | undefined;

    let count = 0;

    for (const line of lines) {
        console.log("Reading line: " + line.join(", "));
        // productId
        const productIdStr = line[0];
        // we do not do nothing with it for now

        // name
        name = line[1]
        if (name !== null) {
            name = name.trim();
        }

        // itemId
        const itemIdStr = line[2];
        if (itemIdStr !== null) {   
            itemId = Number.parseInt(itemIdStr.trim());
            if (Number.isNaN(itemId)) {
                throw new CashRegisterError("Invalid item ID: " + productIdStr);
            }
        } else {
            // if no itemId is set that means we are creating a new single item product
            itemId = 1;
        }

        // Subname
        if (line[3] == null) {
            throw new CashRegisterError("Missing name for item");
        }
        subname = line[3].trim();

        // Price
        let priceStr = line[4];
        if (priceStr === null) {
            if (itemId === 1) {
                throw new CashRegisterError("Missing Price value for item : '" + subname +"'.");
            }
            
            price = undefined;
        } else {
            priceStr = priceStr.trim();
            const priceVal = new Decimal(priceStr.trim());
   
            if (Decimal.isDecimal(priceVal) === false) {
                throw new CashRegisterError("Invalid Price value for item : '" + subname +"'.");
            }
            
            price = {
                value: {
                    value: priceStr,
                    currency: CurrencyManager.getDefaultCurrency().getCode(),
                },
                conditions: [],
            }

            console.log(price);
        }
        

        // Stock
        stock = line[5];
        if (stock !== null) {
            stock = stock.trim();    
            const stockVal = new Decimal(stock);

            if (!Decimal.isDecimal(stockVal)) {
                throw new CashRegisterError("Invalid Stock value for item : '" + subname +"'.");
            }
        }

        // Units
        const unitStr = line[6];
        unit = unitStr !== null ? Unit[unitStr.trim().toUpperCase() as keyof typeof Unit] : Unit.UNIT;
        // Ean
        ean = line[7];

        if (ean !== null && ean !== undefined)
            ean = ean.trim();

        if (itemId === 1 && price !== undefined) {
            console.log("Inserting product: " + name);
            currentProductId = await db.newProduct({
                name: name,
                prices: [price],
                units: unit,
                itemDiscounts: [],
            }) 
        }

        if (currentProductId === undefined) {
            throw new CashRegisterError("Missing product ID for item : '" + subname +"'.");
        }
        
        console.log("Inserting item: " + subname + " with ID: " + itemId + " and product ID: " + currentProductId + ".")

        await db.newItem({
            productId: currentProductId,
            subname: subname,
            stock: stock,
            ean: ean,
            itemId: itemId,
            priceIdxs: [0],
            itemDiscountIdxs: [],
        });
        console.log("Inserted item: " + subname + " with ID: " + itemId + " and product ID: " + currentProductId + ".")

        count++;
    }

    return count;
}
