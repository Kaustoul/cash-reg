import type {DecimalStr} from './money-sum';
import type { ProductStatus } from './product';

export interface IProductVariant {
    variantId: number;
    productId: number;
    subname: string;
    ean: string | null;
    status: ProductStatus;
    createdAt: Date;
    modifiedAt: Date;
}
