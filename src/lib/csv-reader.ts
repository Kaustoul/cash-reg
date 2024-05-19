import fs from 'fs';

/**
 * Reads a CSV file and parses it into a 2D array, replacing empty strings with null.
 * 
 * @param {string} filePath - The path to the CSV file.
 * @returns {string[][]} A 2D array representing the CSV data with empty strings replaced by null.
 */
export function readCSV(filePath: string): (string | null)[][] {
    const csvData: string = fs.readFileSync(filePath, 'utf8');
    const lines: string[] = csvData.split('\n');
    const data: (string | null)[][] = lines.map(row => {
        const values = row.split(',').map(val => val === '' ? null : val);

        // Add null for the last element if the row ends with a comma or windows line ending ;]
        if (values[values.length - 1] === '\r' || values[values.length - 1] === '') {
            values[values.length - 1] = null;
        }
        return values;
    });

    return data;
}