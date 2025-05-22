import { drizzle, type BetterSQLite3Database} from 'drizzle-orm/better-sqlite3';
import { getMigrationsPath } from '../db';
import type { DB } from '../db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { sqliteTills } from './sqlite-tills-data-handler';
import type { TillsDataHandler } from '../tills-data-handler';
import type { TillStatus } from '$lib/shared/interfaces/till';
import type { ProductsDataHandler } from '../products-data-handler';
import type { ItemsDataHandler } from '../items-data-handler';
import { sqliteItems } from './sqlite-items-data-handler';
import { sqliteProducts } from './sqlite-products-data-handler';
import type { INewProduct} from '$lib/shared/interfaces/product';
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
import type { IItem } from '$lib/shared/interfaces/item';
import type { IPrice } from '$lib/shared/interfaces/price';
import type { ICondition } from '$lib/shared/interfaces/condition';
import type { OrdersDataHandler } from '../orders-data-handler';
import { sqliteOrders } from "./splite-orders-data-handler";
import type { INewOrder } from '$lib/shared/interfaces/order';
import { sqliteCustomers } from './sqlite-customers-data-handler';
import type { CustomersDataHandler } from '../customers-data-handler';
import type { ICustomer } from '$lib/shared/interfaces/customer';
import { sqliteCustomerPayments } from './sqlite-customer-payment-data-handler';
import type { CustomerPaymentDataHandler } from '../customer-payment-data-handler';
import type { ICustomerPayment } from '$lib/shared/interfaces/customer-payment';
import type { TransactionsDataHandler } from '../transaction-data-handler';
import { sqliteTransactions } from './sqlite-transactions-data-handler';
import type { TransactionReason, TransactionType } from '$lib/shared/interfaces/transaction';

export class SQLiteDB implements DB {
    readonly db: BetterSQLite3Database;
    readonly _tills: TillsDataHandler;
    readonly _products: ProductsDataHandler;
    readonly _items: ItemsDataHandler;
    readonly _orders: OrdersDataHandler;
    readonly _customers: CustomersDataHandler;
    readonly _customerPayments: CustomerPaymentDataHandler;
    readonly _transactions: TransactionsDataHandler;

    constructor(dbFilePath: string) {
        const sqlite = new Database(dbFilePath);
        this.db = drizzle(sqlite);
        this.defaultSchema();

        this._tills = sqliteTills;
        this._products = sqliteProducts;
        this._items = sqliteItems;
        this._orders = sqliteOrders;
        this._customers = sqliteCustomers;
        this._customerPayments = sqliteCustomerPayments;
        this._transactions = sqliteTransactions;
    }

    defaultSchema(): void {
        console.log('Creating default schema');
        // migrate(this.db, { migrationsFolder: getMigrationsPath() });
    }

    //---------------\\
    // -- PRODUCTS - \\
    //---------------\\

    async fetchProduct(productId: number, fetchItems: boolean = false) {
        return await this._products.fetchProduct(this.db, productId, fetchItems);
    }

    async fetchProducts(fetchItems: boolean = false) {
        return await this._products.fetchProducts(this.db, fetchItems);
    }

    async newProduct(product: INewProduct) {
        return await this._products.newProduct(this.db, product);
    }

    async updatePrices(productId: number, prices: IPrice[]) {
        return await this._products.updatePrices(this.db, productId, prices);
    }

    async updatePrice(productId: number, priceIdx: number, price: IPrice) {
        return await this._products.updatePrice(this.db, productId, priceIdx, price);
    }

    async newPrice(productId: number, price: IPrice, addToAllItems: boolean) {
        return await this._products.newPrice(this.db, productId, price, addToAllItems);
    }

    async removePrices(productId: number, priceIdxs: number[]) {
        return await this._products.removePrices(this.db, productId, priceIdxs);
    }

    async newPriceCondition(productId: number, priceIdx: number, condition: ICondition) {
        return await this._products.newPriceCondition(this.db, productId, priceIdx, condition);
    }

    async removePriceCondition(productId: number, priceIdx: number, conditionIdx: number) {
        return await this._products.removePriceCondition(this.db, productId, priceIdx, conditionIdx);
    }

    async removeAllPriceConditions(productId: number, priceIdx: number) {
        return await this._products.removeAllPriceConditions(this.db, productId, priceIdx);
    }

    //---------------\\
    // --- ITEMS --- \\
    //---------------\\

    async fetchItem(fullItemId: number) {
        return await this._items.fetchItem(this.db, fullItemId);
    }

    async fetchProductItems(productId: number) {
        return await this._items.fetchProductItems(this.db, productId);
    }

    async newItem(item: IItem) {
        return await this._items.newItem(this.db, item);
    }

    async newItemPriceIdxs(productId: number, itemId: number, priceIdxs: number[]) {
        return await this._items.newItemPriceIdxs(this.db, productId, itemId, priceIdxs);
    }

    async removeItemPriceIdxs(productId: number, itemId: number, priceIdxs: number[]) {
        return this._items.removeItemPriceIdxs(this.db, productId, itemId, priceIdxs);
    }

    //---------------\\
    // --- TILLS --- \\
    //---------------\\
    
    async fetchTill(id: number) {
        return await this._tills.fetchTill(this.db, id);
    }

    async fetchTills() {
        return await this._tills.fetchTills(this.db);
    }

    async newTill() {
        return await this._tills.newTill(this.db);
    }

    async changeStatus(tillId: number, status: TillStatus) {
        return await this._tills.changeStatus(this.db, tillId, status);
    }

    async updateBalance(tillId: number, balance: IMoneySum) {
        return await this._tills.updateBalance(this.db, tillId, balance);
    }

    async updateBalanceTransaction(
        tillId: number,
        cashierId: number,
        amount: IMoneySum,
        reason: TransactionReason,
        type: TransactionType,
    ): Promise<void> {
        await this.db.transaction(async (tx) => { 
            await this._tills.updateBalance(tx, tillId, amount);
            await this._transactions.newTransaction(tx, {
                tillId,
                cashierId,
                type,
                reason, 
                amount,
            });
        });
    }

    //---------------\\
    // --- ORDERS ---\\
    // --------------\\

    async fetchOrder(orderId: number) {
        return await this._orders.fetchOrder(this.db, orderId);
    }

    async fetchOrders(date: Date) {
        return await this._orders.fetchOrders(this.db, date);
    }

    async fetchTillOrders(tillId: number, date: Date) {
        return await this._orders.fetchTillOrders(this.db, tillId, date);
    }

    async newOrder(order: INewOrder) {
        return await this._orders.newOrder(this.db, order);
    }

    async markOrderAsPaid(orderId: number, transactionId: number) {
        return await this._orders.markOrderAsPaid(this.db, orderId, transactionId);
    }

    //---------------\\
    // -- CUSTOMERS -\\
    //---------------\\

    async fetchCustomer(customerId: number) {
        return await this._customers.fetchCustomer(this.db, customerId);
    }

    async fetchCustomers() {
        return await this._customers.fetchCustomers(this.db);
    }

    async newCustomer(customer: Omit<ICustomer, "customerId" | "createdAt" | "modifiedAt">) {
        return await this._customers.newCustomer(this.db, customer);
    }

    async updateCustomer(customer: ICustomer) {
        return await this._customers.updateCustomer(this.db, customer);
    }

    async removeCustomer(customerId: number) {
        return await this._customers.removeCustomer(this.db, customerId);
    }

    async updateCustomerBalance(customer: ICustomer, balance: IMoneySum[]) {
        return await this._customers.updateBalance(this.db, customer, balance);
    }

    //-------------------------\\
    // -- CUSTOMER PAYMENTS -- \\
    //-------------------------\\

    async fetchCustomerPayments(customerId: number) {
        return await this._customerPayments.fetchPaymentsForCustomer(this.db, customerId);
    }
    async newCustomerPayment(payment: Omit<ICustomerPayment, "customerPaymentId" | "createdAt">) {
        return await this._customerPayments.newCustomerPayment(this.db, payment);
    }

    async processCustomerDeposit(
        customerId: number,
        amount: IMoneySum,
        paymentType: TransactionType
    ): Promise<void> {
        await this.db.transaction(async (tx) => {
            await this._customerPayments.processCustomerDeposit(tx, customerId, amount, paymentType);
        });
    }
}
