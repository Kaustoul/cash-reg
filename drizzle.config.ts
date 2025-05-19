import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: [
        './src/lib/server/db/schema/product-model.ts',
        './src/lib/server/db/schema/item-model.ts',
        './src/lib/server/db/schema/till-model.ts',
        './src/lib/server/db/schema/*.ts',
    ],
    out: './src/lib/server/db/migrations',
    dialect: 'sqlite',
    verbose: true,
    strict: true,
    dbCredentials: {
        url: './.db',
    },
});
