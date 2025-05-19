export interface ICustomer {
    customerId: number;
    name: string;
    email: string | null;
    phone: string | null;
    note: string | null;
    createdAt: Date;
    modifiedAt: Date;
}