import type Decimal from "decimal.js";
import { CashRegisterError, ErrCode } from "./cash-register-error";

export class NotEnoughStockError extends CashRegisterError {
    public readonly code = ErrCode.NOT_ENOUGH_STOCK;
    public itemId: number;
    public requested: Decimal;
    public stock: Decimal;

    constructor(itemId: number, requested: Decimal, stock: Decimal) {
        super(`Not enough stock for item '${itemId}': Requested stock: '${requested}'; actual stock: '${stock}'; missing stock: '${requested.sub(stock)}'.`);
        this.itemId = itemId;
        this.requested = requested;
        this.stock = stock;
    }
}
