import type {DecimalStr} from './money-sum';

export interface IProductVariant {
    variantId: number;
    productId: number;
    subname: string;
    ean: string | null;
    isActive: boolean;
    createdAt?: Date;
}
