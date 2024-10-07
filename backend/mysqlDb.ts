import mysql, { Pool } from 'mysql2/promise';
import config from './config';

let pool: Pool;

const mysqlDb = {
    async init() {
        pool = mysql.createPool(config.db);
    },
    getConnection(): Promise<mysql.PoolConnection> {
        return pool.getConnection();
    }
};

export default mysqlDb;