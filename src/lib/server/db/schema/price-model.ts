import { Price, type PriceModel } from "../../../shared/prices/price";
import { customType } from "drizzle-orm/sqlite-core";

export const priceListModel = customType<
    {
        data: Price[];
        driverData: PriceModel[] | string;
    }
>({
    dataType() {
        return "TEXT";
    },

    toDriver(value: Price[]): PriceModel[] | string {
        const res: PriceModel[] = [];
        for (const price of value) {
            res.push(price.toJSON());
        }

        return JSON.stringify(res);
    },

    fromDriver(value: PriceModel[] | string): Price[] {
        // getting rid of TS errors :]
        if (typeof value !== "string") {
            return []; 
        }

        const json = JSON.parse(value);

        const res: Price[] = [];
        for (const price of json) {
            res.push(Price.fromJSON(price));
        }
        
        return res;
    },
});

export const priceModel = customType<
  {
    data: Price;
    driverData: PriceModel;
  }
>({
    dataType() {
        return "TEXT";
    },

    toDriver(value: Price): PriceModel {
        return value.toJSON();
    },

    fromDriver(value: PriceModel): Price {
        return Price.fromJSON(value);
    },
});
