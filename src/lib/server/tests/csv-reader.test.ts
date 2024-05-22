import { readCSV } from "$lib/server/data-handlers/csv-reader";
import { readFileSync } from 'fs';
import { expect, test } from "vitest";
import path from 'path';


// Compare the JSON content with the result from readCSV
export function testCsvData(): (string | null)[][] {
    const expectedOutPath = path.join('src', 'lib', 'server', 'test', 'data', 'items.out.json');
    const expectedOutFile = readFileSync(expectedOutPath, 'utf-8');
    return JSON.parse(expectedOutFile);
}

export function testItemsCSVPath(): string {
    return path.join('src', 'lib', 'server', 'test', 'data', 'items.csv');
}

test('readCSV returns correct data.', () => {
    const filePath = testItemsCSVPath();
    const csvData = readCSV(filePath);

    expect(csvData).toStrictEqual(testCsvData());
});