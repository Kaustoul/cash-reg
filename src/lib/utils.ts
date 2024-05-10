export function ensureArray<T>(value: Array<T> | T | undefined, emptyOnUndefined: boolean = false): Array<T> | undefined {
    if (value === undefined) {
        if (emptyOnUndefined)
            return []
        else
            return undefined;
    }

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}