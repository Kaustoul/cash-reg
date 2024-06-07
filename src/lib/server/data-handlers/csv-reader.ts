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

export function parseCSV(csvData: string): (string | null)[][] {
    const res: (string | null)[][] = [];
    const lines: string[] = csvData.split('\n');
    for (const line of lines) {
        if (/^,*$/.test(line.trim())) {
            continue;
        }

        const row: (string | null)[] = [];
        let value = '';
        let insideQuotes = false;

        for (const char of line) {

            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                // End of the current value
                value = value.trim();
                row.push(value === '' ? null : value);
                value = '';
            } else {
                value += char;
            }
        }

        // Add the last value
        value = value.trim();
        row.push(value === '' ? null : value);

        res.push(row);
    }

    return res;
}
