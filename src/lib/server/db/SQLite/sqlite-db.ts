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
import { sqliteOrders } from './splite-orders-data-handler';
import type { INewOrder } from '$lib/shared/interfaces/order';

export class SQLiteDB implements DB {
    readonly db: BetterSQLite3Database;
    readonly _tills: TillsDataHandler;
    readonly _products: ProductsDataHandler;
    readonly _items: ItemsDataHandler
    readonly _orders: OrdersDataHandler;

    constructor(dbFilePath: string) {
        const sqlite = new Database(dbFilePath);
        this.db = drizzle(sqlite);
        this.defaultSchema();

        this._tills = sqliteTills;
        this._products = sqliteProducts;
        this._items = sqliteItems;
        this._orders = sqliteOrders;
    }

    defaultSchema(): void {
        console.log('Creating default schema');
        migrate(this.db, { migrationsFolder: getMigrationsPath() });
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

    async recordBalanceUpdate(
        tillId: number,
        amount: IMoneySum,
        reason: 'cash-payment' | 'withdraw' | 'deposit', 
        orderId?: number,
    ): Promise<void> {
        return await this._tills.recordBalanceUpdate(this.db, tillId, amount, reason, orderId);
    }

    async updateBalanceTransaction(
        tillId: number,
        amount: IMoneySum,
        reason: 'cash-payment' | 'withdraw' | 'deposit',
        orderId?: number
    ): Promise<void> {
        await this.db.transaction(async (tx) => { 
            await this._tills.updateBalance(tx, tillId, amount);
            await this._tills.recordBalanceUpdate(
                tx,
                tillId,
                amount,
                reason, 
                orderId
            );
        });
    }

    //---------------\\
    // --- ORDERS ---\\
    // --------------\\

    async fetchOrder(orderId: number) {
        return await this._orders.fetchOrder(this.db, orderId);
    }

    async fetchOrders(tillId: number) {
        return await this._orders.fetchOrders(this.db, tillId);
    }

    async newOrder(order: INewOrder) {
        return await this._orders.newOrder(this.db, order);
    }

    async newOrderTransaction(order: INewOrder) {
        await this.db.transaction(async (tx) => {
            const orderId = await this._orders.newOrder(tx, order);

            if (order.paymentType === 'cash') {
                // update balance;
                await this._tills.updateBalance(tx, order.tillId, order.total);
                await this._tills.recordBalanceUpdate(
                    tx,
                    order.tillId,
                    order.total,
                    'cash-payment',
                    orderId
                );

            }
        });
    }
}
