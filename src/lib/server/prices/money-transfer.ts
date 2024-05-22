import { CashRegisterError } from "$lib/server/errors/cash-register-error";
import { ensureArray } from "$lib/shared/utils";
import type { MoneySum } from "./money-sum";

export enum MoneyTransferType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    PAYMENT = "PAYMENT",
    PURCHASE = "PURCHASE",
    EXPENSE = "EXPENSE",
}

export class MoneyTransfer {
    private readonly type: MoneyTransferType;
    private readonly moneySums: MoneySum[];
    private readonly note?: string;
    private readonly cashierId: number
    private readonly recieptId: number | undefined;

    public constructor(type: MoneyTransferType, moneySums: MoneySum | MoneySum[], cashierId: number, note?: string, recieptId?: number) {
        this.type = type;
        this.moneySums = ensureArray(moneySums);
        this.note = note;
        this.cashierId = cashierId
        this.recieptId = recieptId;
    }

    public getNote(): string | undefined {
        return this.note;
    }

    /**
     * Get the money sums based on whether it's a single price or multiple prices.
     *
     * @return {MoneySum[] | MoneySum} The money sums or a single money sum.
     */
    public getMoneySums(): MoneySum[] | MoneySum {
        if (this.isSinglePrice()) {
            return this.moneySums[0];
        }

        return this.moneySums;
    }

    private isSinglePrice(): boolean {
        return this.moneySums.length === 1;
    }

    public getCashierId(): number {
        return this.cashierId;
    }

    public getType(): MoneyTransferType {
        return this.type;
    }

    public getRecieptId(): number {
        if (this.type !== MoneyTransferType.PURCHASE) {
            throw new CashRegisterError("Cannot get reciept id for non-purchase transfer");
        }

        return this.recieptId!;
    }

    public toJSON() {
        return {
            moneySums: this.moneySums,
            note: this.note
        };
    }
}