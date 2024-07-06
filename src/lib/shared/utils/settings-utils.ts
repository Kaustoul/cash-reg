import { type ISettings } from '../interfaces/settings';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

export const settings: ISettings = loadSettings();

function getSeetingsPath(): string {
    if (process.env.NODE_ENV === 'dev') {
        return 'settings.json';
    }

    if (process.env.APP_PATH == undefined) {
        return "-1.-1";
        throw new Error('APP_PATH is not set');
    }

    return join(process.env.APP_PATH, '..', '..', 'settings.json');
}

function loadSettings(): ISettings {
    const path = getSeetingsPath(); 

    if (!existsSync(path)) {
        return {
            sepaSettings: {
                enabled: false,
            }
        };
    }

    const file = readFileSync(path, 'utf8');
    return {
        sepaSettings: {
            ...JSON.parse(file)
        }
    };
}
