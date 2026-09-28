require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const schema = fs.readFileSync(
            path.join(__dirname, '../sql/schema.sql'),
            'utf8',
        );

        const seed = fs.readFileSync(
            path.join(__dirname, '../sql/seed.sql'),
            'utf8',
        );

        console.log('Applying database schema...');
        await pool.query(schema);

        console.log('Seeding database...');
        await pool.query(seed);

        console.log('Database setup completed.');
    } finally {
        await pool.end();
    }
}

setupDatabase().catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
});