import type {DecimalStr} from './money-sum';

export interface IItem {
    itemId: number;
    productId: number;
    subname: string;
    stock: DecimalStr | null;
    priceIdxs: number[];
    itemDiscountIdxs: number[];
    ean: string | null;
    createdAt?: Date;
    modifiedAt?: Date;
}
