import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: [
        './src/db/schema/product-model.ts',
        './src/db/schema/item-model.ts',
        './src/db/schema/till-model.ts',
        './src/db/schema/*.ts',
    ],
    out: './src/db/migrations',
    dialect: 'sqlite',
    verbose: true,
    strict: true,
    dbCredentials: {
        url: '',
    },
});