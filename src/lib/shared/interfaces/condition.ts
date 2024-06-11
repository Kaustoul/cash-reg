export interface ICondition {
    type: "MinVolume" | "MaxVolume" | "CartTotal",
    value: string;
}

