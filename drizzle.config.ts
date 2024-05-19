import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: [
        './db/schema/product-model.ts',
        './db/schema/item-model.ts',
        './db/schema/till-model.ts',
        './db/schema/*.ts',
    ],
    out: './db/migrations',
    dialect: 'sqlite',
    verbose: true,
    strict: true,
});