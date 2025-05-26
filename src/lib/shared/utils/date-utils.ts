
import { format, parse } from 'date-fns';

export type DateFormatOptions = {
    date?: boolean;
    time?: boolean;
    weekday?: boolean;
}

export function formatDate(date: Date | number, formatOptoins: DateFormatOptions = {date: true, time: true}): string {
    if (!date) {
        return '-';
    }
    
    if (typeof date === 'number') {
        date = new Date(date * 1000); // Convert timestamp to Date
    } else if (!(date instanceof Date)) {
        throw new TypeError('Expected a Date object or a timestamp');
    }

    let formatString = '';
    if (formatOptoins.weekday) {
        formatString += 'EEEE, '; // Full weekday name
    }

    if (formatOptoins.date) {
        formatString += 'dd.MM.yyyy'; // Day, Month, Year
    }

    if (formatOptoins.time) {
        if (formatString) {
            formatString += ' '; // Add space if date is included
        }
        formatString += 'HH:mm'; // 24-hour format
    }
    
    return format(date, formatString);
    // Accepts Date or timestamp
    // if (!includeDate && !includeTime) {
    //     return '';
    // }

    // const d = typeof date === "number" ? new Date(date * 1000) : new Date(date);
    // const day = d.getDate(); // no pad
    // const month = String(d.getMonth() + 1).padStart(2, '0');
    // const year = d.getFullYear();
    // const hours = d.getHours(); // no pad
    // const minutes = String(d.getMinutes()).padStart(2, '0');

    // if (!includeDate && includeTime) {
    //     return `${hours}:${minutes}`;
    // }
    
    // if (includeDate && !includeTime) {
    //     return `${day}.${month}.${year}`;
    // }

    // return `${day}.${month}.${year} ${hours}:${minutes}`;
}
