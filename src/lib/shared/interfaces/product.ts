export type ProductStatus = "draft" | "active" | "archived" | "deleted";

export interface IProduct {
    productId: number;
    name: string;
    units: Unit;
    status: ProductStatus;
    createdAt: Date;
    modifiedAt: Date;
}

export type INewProduct = Omit<IProduct, "productId" | "status" | "createdAt" | "modifiedAt">;

export type Unit = "ks" | "Kg" | "g"; 
