import { CashRegisterError, ErrCode } from "./cash-register-error";

// Code 50-60
export class NotFoundError extends CashRegisterError {
    private readonly fieldName: string;

    constructor(code: ErrCode, lookingForId?: number, parentId?: number) {
        let fieldName;
        let parentName;
        switch (code) {
            case ErrCode.PRODUCT_NOT_IN_CATALOG:
                fieldName = "Product";
                parentName = "Catalog";
                break;
            
            case ErrCode.ITEM_NOT_IN_PRODUCT:
                fieldName = "Item";
                parentName = "Product";
                break;
        
            case ErrCode.DISCOUNT_NOT_ON_PRODUCT:
                fieldName = "Discount";
                parentName = "Product"
                break;
            
            case ErrCode.CONDITION_NOT_IN_CONDITIONAL:
                fieldName = "Condition"
                parentName = "Conditional"
                break;
            
            default: 
                throw new CashRegisterError("Reached unreachable in NotFoundError.");
        }

        if (lookingForId) {
            fieldName += `(${lookingForId})`;
        }

        if (parentId) {
            parentName += `(${parentId})`;
        }

        super(`Tried to acces a non existent field of type '${fieldName}' in '${parentName}'.`, code);
        this.fieldName = fieldName;
    }
}
