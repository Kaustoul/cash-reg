import { CashRegisterError, ErrCode } from "./cash-register-error";

// Code 61-70
export class DuplicateError extends CashRegisterError {
    constructor(code: ErrCode, duplicateId: number) {
        let fieldName: string;
        let className: string;
        switch (code) {
            case ErrCode.DUPLICATE_ITEM_ID:
                fieldName = "Item";
                className = "Product";
                break;
            
            default: 
                throw new CashRegisterError("Reached unreachable in NotFoundError.");
        }

        super(`Tried to create a duplicate object: '${fieldName}(${duplicateId})' in '${className}'`);
    }
}