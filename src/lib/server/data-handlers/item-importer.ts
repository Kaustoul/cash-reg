import Decimal from "decimal.js";
import { readCSV } from "./csv-reader";
import { Price } from "../prices/price";
import { Unit } from "../products/product";
import { CashRegisterError } from "../errors/cash-register-error";
import { Catalog } from "../till/catalog";
import { db } from "../db/db";

export async function importItemsAndProductsFromCSV(filePath: string, database: any = db): Promise<void> {
    const csvData = readCSV(filePath);
    const lines = csvData.filter(line => line[0] !== null).concat(csvData.filter(line => line[0] === null));

    let productId: number | undefined;
    let itemId: number | undefined;
    let name: string | null;
    let subname: string;
    let price: Price;
    let stock: Decimal | undefined;
    let unit: Unit;
    let ean: string | null;

    let currentProductId: number | undefined;
    let currentPrice: Price
    let lastItemId: number | undefined;

    for (const line of lines) {
        // productId
        const productIdStr = line[0];
        if (productIdStr !== null) {   
            productId = Number.parseInt(productIdStr);
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
            itemId = Number.parseInt(itemIdStr);
            if (Number.isNaN(itemId)) {
                throw new CashRegisterError("Invalid item ID: " + productIdStr);
            }
            
            if (productId !== undefined && Catalog.containsItem(productId, itemId)) {
                throw new CashRegisterError("Item with ID " + productId + " already exists in the catalog.");
            }
        }

        // Subname
        if (line[3] == null) {
            throw new CashRegisterError("Missing name for item");
        }
        subname = line[3]

        // Price
        const priceStr = line[4];
        if (priceStr === null) {
            if (itemId === undefined || itemId === 1) {
                throw new CashRegisterError("Missing Price value for item : '" + subname +"'.");
            }

            price = currentPrice!;
        } else {
            let priceVal = new Decimal(priceStr);
   
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
            stock = new Decimal(stockStr);

            if (!Decimal.isDecimal(stock)) {
                throw new CashRegisterError("Invalid Stock value for item : '" + subname +"'.");
            }
        }
        
        // Units
        let unitStr = line[6];
        unit = unitStr !== null ? Unit[unitStr.toUpperCase() as keyof typeof Unit] : Unit.UNIT;
        
        // Ean
        ean = line[7];

        if (itemId === undefined || itemId === 1) {
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

        await Catalog.insertNewItem(database, currentProductId, subname, [0], stock, ean === null ? undefined : ean, itemId === undefined ? 1 : itemId);
        lastItemId = itemId;
    }
}