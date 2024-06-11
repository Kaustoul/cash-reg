import type { ICondition } from "../interfaces/condition";
import type { IUnit } from "../interfaces/product";

export const formatConditionStrs = (
    conditions: ICondition[],
    units?: IUnit
): string[] => {
    const res = []

    for (const cond of conditions) {
        switch (cond.type) {
            case "MinVolume":
            case "MaxVolume": {
                const sign = cond.type === "MinVolume" ? "≥" : "≤";
                if (units === undefined || units === "ks") {
                    res.push(`množství ${sign} ${cond.value}` + (units === "ks" ? units : ""));
                    break;
                }

                if (units === "g" || units === "Kg") {
                    if (cond.type === "MinVolume")
                        res.push(`${cond.value}${units} ≤ váha`);
                    else
                        res.push(`váha ≤ ${cond.value}${units}`);
                    break;
                }
                res.push(`${cond.type}: ${cond.value}`);
                break;
            }
            case "CartTotal": {
                res.push(`CartTotal: ${cond.value} `);
                break;
            }

            default:
                res.push(`${cond.type}: ${cond.value}`);
        }
    }
    return res;
}
