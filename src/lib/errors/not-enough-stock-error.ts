import type Decimal from "decimal.js";

export class NotEnoughStockError extends Error {
    public itemId: number;
    public requested: Decimal;
    public stock: Decimal;

    constructor(itemId: number, requested: Decimal, stock: Decimal) {
        super(`Not enough stock for item '${itemId}': Requested stock: '${requested}'; actual stock: '${stock}'; missing stock: '${requested.sub(stock)}'.`);
        this.name = "NotEnoughStockException";
        this.itemId = itemId;
        this.requested = requested;
        this.stock = stock;
    }
}