import { compare, hash } from "bcryptjs";

/**
 * Compare a plain password with a hash.
 */
export async function matchPassword(plain: string, hashValue: string): Promise<boolean> {
    return await compare(plain, hashValue);
}

/**
 * Hash a plain password.
 */
export async function hashPassword(plain: string, saltRounds = 10): Promise<string> {
    return await hash(plain, saltRounds);
}

/**
 * Options for password generation.
 */
export interface PasswordGenOptions {
    length?: number;
    lowercase?: boolean;
    uppercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";

/**
 * Generate a random password with configurable character sets.
 */
export function generatePassword(options: PasswordGenOptions = {length: 8, lowercase: true, uppercase: true, numbers: true}): string {
    const {
        length = 12,
        lowercase = true,
        uppercase = false,
        numbers = true,
        symbols = false,
    } = options;

    let chars = "";
    if (lowercase) chars += LOWERCASE;
    if (uppercase) chars += UPPERCASE;
    if (numbers) chars += NUMBERS;
    if (symbols) chars += SYMBOLS;

    if (!chars) throw new Error("At least one character type must be enabled.");

    let password = "";
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        password += chars[idx];
    }
    return password;
}