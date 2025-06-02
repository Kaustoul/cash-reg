import { drizzle, type BetterSQLite3Database} from 'drizzle-orm/better-sqlite3';
import { getMigrationsPath } from '../db';
import type { DB } from '../db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { sqliteTills } from './sqlite-tills-data-handler';
import type { TillsDataHandler } from '../tills-data-handler';
import type { ITill } from '$lib/shared/interfaces/till';
import type { ProductsDataHandler } from '../products-data-handler';
import type { INewProduct, IProduct, ProductStatus} from '$lib/shared/interfaces/product';
import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
import type { IProductVariant } from '$lib/shared/interfaces/product-variant';
import type { IPrice } from '$lib/shared/interfaces/product-price';
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
import { sqliteTillSessions } from './sqlite-till-sessions-data-handler';
import { sqliteTillChecks } from './sqlite-till-checks-data-handler';
import type { TillSessionsDataHandler } from '../till-sessions-data-handler';
import type { TillChecksDataHandler } from '../till-checks-data-handler';
import type { INewTillCheck } from '$lib/shared/interfaces/till-check';
import type { INewTillSession } from '$lib/shared/interfaces/till-session';
import type { PermissionsDataHandler } from '../permissions-data-handler';
import { sqlitePermissions } from './sqlite-permissions-data-handler';
import type { PermissionLeaf } from '$lib/shared/permissions';
import { sqliteUsers } from './sqlite-users-data-handler';
import type { UserDataHandler } from '../users-data-handler';
import type { IFrontEndUser, IFrontEndUserWithLogin, INewGroup, INewUser, IUser } from '$lib/shared/interfaces/user';
import { sqliteGroups } from './sqlite-groups-data-handler';
import type { GroupsDataHandler } from '../groups-data-handler';
import { setupDefaultAdminUser, setupDefaultGroups, setupDefaultPermissions } from './sqlite-prepopulate';
import type { IDiscount } from '$lib/shared/interfaces/discount';
import type { IBalance, IFrontEndBalance } from '$lib/shared/interfaces/balance';
import { calculateBalanceTotal } from '$lib/shared/utils/balance-utils';
import type { IShoppingCart } from '$lib/shared/interfaces/shopping-cart';
import { sqliteProductPrices } from './sqlite-product-prices-data-handler';
import type { ProductPricesDataHandler } from '../product-prices-data-handler';
import { sqliteProductVariants } from './sqlite-product-variants-data-handler';
import type { ProductVariantsDataHandler } from '../product-variants-data-handler';
import { sqliteProducts } from './sqlite-products-data-handler';

export class SQLiteDB implements DB {
    readonly db: BetterSQLite3Database;
    readonly _tills: TillsDataHandler;
    readonly _products: ProductsDataHandler;
    readonly _productVariants: ProductVariantsDataHandler;
    readonly _productPrices: ProductPricesDataHandler;
    readonly _orders: OrdersDataHandler;
    readonly _customers: CustomersDataHandler;
    readonly _customerPayments: CustomerPaymentDataHandler;
    readonly _transactions: TransactionsDataHandler;
    readonly _tillSessions: TillSessionsDataHandler;
    readonly _tillChecks: TillChecksDataHandler;
    readonly _permissions: PermissionsDataHandler;
    readonly _users: UserDataHandler;
    readonly _groups: GroupsDataHandler;

    static async create(dbFilePath: string): Promise<SQLiteDB> {
        console.log(`Creating SQLiteDB instance with file: ${dbFilePath}`);
        const instance = new SQLiteDB(dbFilePath);
        await instance.init(instance.db);
        console.log('SQLiteDB instance created and initialized');
        return instance;
    }

    constructor(dbFilePath: string) {
        const sqlite = new Database(dbFilePath);
        this.db = drizzle(sqlite);
        this.defaultSchema();

        this._tills = sqliteTills;
        this._products = sqliteProducts;
        this._productVariants = sqliteProductVariants;
        this._productPrices = sqliteProductPrices;
        this._orders = sqliteOrders;
        this._customers = sqliteCustomers;
        this._customerPayments = sqliteCustomerPayments;
        this._transactions = sqliteTransactions;
        this._tillSessions = sqliteTillSessions;
        this._tillChecks = sqliteTillChecks;
        this._permissions = sqlitePermissions; // sqlitePermissions; // Not implemented yet
        this._users = sqliteUsers;
        this._groups = sqliteGroups;
    }

    defaultSchema(): void {
        console.log('Creating default schema');
        // migrate(this.db, { migrationsFolder: getMigrationsPath() });
    }

    async init(db: BetterSQLite3Database): Promise<void> {
        // Ensure the database is ready
        // await migrate(this.db, { migrationsFolder: getMigrationsPath() });

        // Setup default groups, users, and permissions
        await setupDefaultGroups(db);
        await setupDefaultPermissions(db);
        await setupDefaultAdminUser(db);
    }

    //---------------\\
    // -- PRODUCTS - \\
    //---------------\\

    async fetchProduct(productId: number): Promise<IProduct> {
        return await this._products.fetchProduct(this.db, productId);
    }

    async fetchProducts() {
        return await this._products.fetchProducts(this.db);
    }

    async newProduct(product: INewProduct) {
        return await this.db.transaction(async (tx) => {
            const productId = await this._products.newProduct(tx, product);
            await this._productVariants.newVariant(tx, productId);

            return productId;
        });
    }

    async updateProduct(productId: number, data: Partial<IProduct>): Promise<void> {
        return await this.db.transaction(async (tx) => {
            const res = await this._products.updateProduct(tx, productId, { ...data, modifiedAt: new Date() });

            if (!data.name || !data.status) return;

            const variants = await this._productVariants.fetchProductVariants(tx, productId);
            const variantData: Partial<IProductVariant> = {modifiedAt: new Date()};
            
            if (data.name) {
                variantData.subname = data.name;
            }

            if (data.status) {
                variantData.status = data.status;
            }

            if (variants && variants.length === 1) {
                await this._productVariants.updateVariant(tx, variants[0].variantId, variantData);
            }
        });
    }

    async modifiedProduct(productId: number): Promise<void> {
        return await this._products.modifiedProduct(this.db, productId);
    }

    //--------------------------\\
    // --- PRODUCT VARIANTS --- \\
    //--------------------------\\

    async fetchVariant(variantId: number) {
        return await this._productVariants.fetchVariant(this.db, variantId);
    }

    async fetchProductVariants(productId: number) {
        return await this._productVariants.fetchProductVariants(this.db, productId);
    }

    async fetchProductVariantsCount(productId: number): Promise<number> {
        return await this._productVariants.fetchProductVariantsCount(this.db, productId);
    }

    async newVariant(productId: number): Promise<number> {
        return await this.db.transaction(async (tx) => {
            const res = await this._productVariants.newVariant(tx, productId);

            if (!res) {
                throw new Error(`Failed to create new variant for product ID ${productId}`);
            }

            await this._products.modifiedProduct(tx, productId);

            return res;
        });
    }

    async updateVariant(variantId: number, update: Partial<IProductVariant>) {
        return await this.db.transaction(async (tx) => {
            const res = await this._productVariants.updateVariant(this.db, variantId, update);
            await this._products.modifiedProduct(tx, res);
        });
    }

    //------------------------\\
    // --- PRODUCT PRICES --- \\
    //------------------------\\

    async fetchPricesForProduct(productId: number): Promise<IPrice[]> {
        return await this._productPrices.fetchPricesForProduct(this.db, productId);
    }

    //---------------\\
    // --- TILLS --- \\
    //---------------\\
    
    async fetchTill(tillId: number) {
        return await this._tills.fetchTill(this.db, tillId);
    }

    async fetchTills(): Promise<ITill[] | null> {
        let tills = await this._tills.fetchTills(this.db);
        // let formattedTills: IFrontEndTill[] = [];

        // for (const till of tills) {
        //     const tillSession = await this._tillSessions.fetchLastSessionTill(this.db, till.id);

        //     if (!tillSession) {
        //         formattedTills.push({
        //             ...till,
        //             balance: calculateBalanceTotal(till.balance),
        //             cashierId: null,
        //             state: 'CLOSED',
        //         });
        //     } else {

        //         formattedTills.push({
        //             ...till,
        //             balance: calculateBalanceTotal(till.balance),
        //             cashierId: tillSession.type === "CLOSED" ? null : tillSession.cashierId,
        //             state: tillSession.type,
        //         });
        //     }
        // }

        return tills;
    }

    async newTill() {
        return await this._tills.newTill(this.db);
    }

    async sumAndUpdateBalance(tillSessionId: number, addBalance: IBalance) {
        return await this._tills.sumAndUpdateBalance(this.db, tillSessionId, addBalance);
    }

    async sumAndUpdateBalanceTransaction(
        tillSessionId: number,
        amount: IBalance,
        reason: TransactionReason,
        type: TransactionType,
    ): Promise<void> {
        await this.db.transaction(async (tx) => { 
            await this._tills.sumAndUpdateBalance(tx, tillSessionId, amount);
            await this._transactions.newTransaction(tx, {
                tillSessionId,
                paymentType: type,
                isPaid: true,
                reason, 
                amount,
            });
        });
    }

    //---------------------\\
    // -- TILL SESSIONS -- \\
    //---------------------\\

    async fetchTillSession(id: number) {
        return await this._tillSessions.fetchSession(this.db, id);
    }

    async fetchTillSessionsForTill(tillId: number) {
        return await this._tillSessions.fetchSessionsForTill(this.db, tillId);
    }

    async newTillSession(session: INewTillSession) {
        return await this._tillSessions.newSession(this.db, session);
    }

    async fetchLastOpenSessionForUser(userId: number) {
        return await this._tillSessions.fetchLastOpenSessionForUser(this.db, userId);
    }

    async fetchLastSessionTill(tillId: number) {
        return await this._tillSessions.fetchLastSessionTill(this.db, tillId);
    }

    async fetchSessionsForUser(userId: number) {
        return await this._tillSessions.fetchSessionsForUser(this.db, userId);
    }

    async fetchUserIdByTillSessionId(tillSessionId: number): Promise<number | null> {
        const res = await this._tillSessions.fetchSession(this.db, tillSessionId);

        if (!res) {
            return null; 
        }

        return res.cashierId ?? null;
    }

    //-------------------\\
    // -- TILL CHECKS -- \\
    //-------------------\\

    async fetchTillCheck(id: number) {
        return await this._tillChecks.fetchCheck(this.db, id);
    }

    async fetchTillSessionChecks(tillSessionId: number) {
        return await this._tillChecks.fetchChecksForSession(this.db, tillSessionId);
    }

    async fetchTillChecks(tillSessionId: number, date?: Date) {
        return await this._tillChecks.fetchChecksForTill(this.db, tillSessionId, date);
    }

    async newTillCheck(check: INewTillCheck) {
        return await this._tillChecks.newCheck(this.db, check);
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

    async newOrder(order: IShoppingCart) {
        return await this._orders.newOrder(this.db, order);
    }

    async markOrderAsPaid(orderId: number, transactionId: number) {
        return await this._orders.markOrderAsPaid(this.db, orderId, transactionId);
    }

    async fetchOrderByTransactionId(transactionId: number) {
        return await this._orders.fetchOrderByTransactionId(this.db, transactionId);
    }

    async fetchCustomerOrders(customerId: number) {
        return await this._orders.fetchCustomerOrders(this.db, customerId);
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

    async updateCustomer(customerId: number, data: {name?: string; surname?: string; email?: string; discount?: IDiscount | undefined}): Promise<void> {
        return await this._customers.updateCustomer(this.db, customerId, data);
    }

    async removeCustomer(customerId: number) {
        return await this._customers.removeCustomer(this.db, customerId);
    }

    async updateCustomerBalance(customer: ICustomer, balance: IMoneySum) {
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
        tillSessionId: number,
        customerId: number,
        amount: IFrontEndBalance,
    ): Promise<void> {
        await this.db.transaction(async (tx) => {
            await this._customerPayments.processCustomerDeposit(tx, tillSessionId, customerId, amount);
        });
    }

    //--------------------\\
    // -- TRANSACTIONS -- \\
    //--------------------\\
    
    async fetchTillTransactions(tillSessionId: number) {
        return await this._transactions.fetchTillTransactions(this.db, tillSessionId);
    }

    //-------------\\
    // -- USERS -- \\
    //-------------\\

    async fetchUserById(userId: number) {
        return await this._users.fetchUserById(this.db, userId);
    }

    async newUser(user: INewUser) {
        return await this._users.newUser(this.db, user);
    }

    async updateUserGroup(userId: number, groupId: number) {
        return await this._users.updateUserGroup(this.db, userId, groupId);
    }

    async updateUserPassword(userId: number, passwordHash: string, mustChangePassword: boolean = false) {
        return await this._users.updateUserPassword(this.db, userId, passwordHash, mustChangePassword);
    }

    async fetchAllUsers() {
        return await this._users.fetchAllUsers(this.db);
    }

    async onUserLogin(userId: number, ip: string) {
        return await this._users.onUserLogin(this.db, userId, ip);
    }

    async updateUserInfo(userId: number, data: { name?: string; surname?: string }) {
        return await this._users.updateUserInfo(this.db, userId, data);
    }

    async fetchFrontEndUser(user: IUser): Promise<IFrontEndUser> {
        const group = await this.fetchGroupById(user.groupId);
        const permissions = await this.fetchGroupPermissions(user.groupId) ?? [];
    
        if (!group) {
            throw new Error(`Group with ID ${user.groupId} not found`);
        }

        return {
            userId: user.userId,
            name: user.name,
            surname: user.surname,
            group: group,
            permissions: permissions,
            isAdmin: group?.name === 'admin',
            createdAt: user.createdAt,
        };
    }

    async fetchFrontEndUserWithLogin(user: IUser): Promise<IFrontEndUserWithLogin> {
        const frontEndUser = await this.fetchFrontEndUser(user);
        
        return {
            ...frontEndUser,
            mustChangePassword: user.mustChangePassword,
            lastLogin: user.lastLogin ?? null,
            lastIp: user.lastIp ?? null,
        };
    }

    async fetchFrontEndUsers(): Promise<IFrontEndUser[]> {
        const users = await this._users.fetchAllUsers(this.db);
        const groups = await this._groups.fetchGroups(this.db);
     
        const frontEndUsers: IFrontEndUser[] = [];
        for (const user of users) {
            const group = groups.find(g => g.groupId === user.groupId);
            
            if (!group) {
                throw new Error(`Group with ID ${user.groupId} not found for user ${user.userId}`);
            }


            frontEndUsers.push({
                userId: user.userId,
                name: user.name,
                surname: user.surname,
                group: group,
                isAdmin: group.name === 'admin',
                createdAt: user.createdAt,
                permissions: [],
            });
        }

        return frontEndUsers;
    }
    
    //--------------\\
    // -- GROUPS -- \\
    //--------------\\

    async fetchGroupById(groupId: number) {
        return await this._groups.fetchGroupById(this.db, groupId);
    }
    
    async fetchGroups() {
        return await this._groups.fetchGroups(this.db);
    }

    async newGroup(group: INewGroup) {
        return await this._groups.newGroup(this.db, group);
    }

    async updateGroup(groupId: number, group: Partial<INewGroup>) {
        return await this._groups.updateGroup(this.db, groupId, group);
    }

    async setGroupPermission(groupId: number, permissionId: string, enabled: boolean) {
        return await this._groups.setGroupPermission(this.db, groupId, permissionId, enabled);
    }

    async fetchGroupPermissions(groupId: number) {
        return await this._groups.fetchGroupPermissions(this.db, groupId);
    }

    //-------------------\\
    // -- PERMISSIONS -- \\
    //-------------------\\

    async fetchPermissions() {
        return await this._permissions.fetchAllPermissions(this.db);
    }

    async fetchPermission(permissionKey: string) {
        return await this._permissions.fetchPermissionById(this.db, permissionKey);
    }

    async newPermission(permissionKey: string, data: PermissionLeaf) {
        return await this._permissions.newPermission(this.db, permissionKey, data);
    }

    async groupHasPermission(groupId: number, permissionId: string): Promise<boolean> {
        return await this._permissions.groupHasPermission(this.db, groupId, permissionId);
    }
}
