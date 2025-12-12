import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Parse DB URL to get credentials but connect to 'postgres' db
// Assumes standard connection string format
const dbUrl = process.env.DATABASE_URL || '';
const baseDbUrl = dbUrl.replace(/\/[^/]+$/, '/postgres');

const client = new Client({
    connectionString: baseDbUrl,
});

async function createDb() {
    try {
        await client.connect();
        console.log("Connected to postgres DB");

        const dbName = 'my_db';
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully`);
        } else {
            console.log(`Database ${dbName} already exists`);
        }
    } catch (err) {
        console.error("Error creating database:", err);
    } finally {
        await client.end();
    }
}

createDb();
