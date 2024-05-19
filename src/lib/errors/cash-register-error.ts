export enum ErrCode {
    NOT_ENOUGH_STOCK = 40,
    PRODUCT_NOT_IN_CATALOG = 50,
    ITEM_NOT_IN_PRODUCT = 51,
    DISCOUNT_NOT_ON_PRODUCT = 52,
    CONDITION_NOT_IN_CONDITIONAL = 60,

    DUPLICATE_ITEM_ID = 61,


    INTERNAL = 99,
}


export class CashRegisterError extends Error {
    public readonly code: ErrCode = ErrCode.INTERNAL;
    public readonly message: string;

    constructor(message: string, code?: ErrCode) {
        super(message);
        // Same as this classes name (name of the constructor)
        this.name = this.constructor.name;
        this.message = message;

        if (code) {
            this.code = code;
        }
        
        this.logError();
    }

    private logError(): void {
        // Logger.log(`Error ${this.code}: ${this.message}`);
    }
}