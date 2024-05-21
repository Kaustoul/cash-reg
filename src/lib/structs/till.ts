import { MoneySum } from "./prices/money-sum";
import { ensureArray } from "$lib/utils";

class Till {
    private open: boolean;
    private balance: MoneySum[];
    // private cashier: Employee;
    // private sessions: TillSession[];

    constructor(balance: MoneySum | MoneySum[] = MoneySum.ZERO() ) {
        this.open = false;
        this.balance = ensureArray(balance); 
        // this.cashier = new Employee();
        // this.sessions = [];
    }

    public newTillSession(): void {
        
    }

    public saveTillSession(): void {
        // Implement the logic to save a till session
    }

    public loadTillSession(): void {
        // Implement the logic to load a till session
    }
}