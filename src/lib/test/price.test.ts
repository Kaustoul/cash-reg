import { Price } from "$lib/structs/prices/price";
import { expect, test } from "vitest"
import { testCZKcurrency } from "./money-sum.test";
import Decimal from "decimal.js";

export function testPrice(value: Decimal = new Decimal(100)): Price {
    return new Price(testCZKcurrency(), value);
}