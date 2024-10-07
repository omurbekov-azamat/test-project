import mysql, {Connection} from 'mysql2/promise';
import config from './config'
import bcrypt from "bcrypt";

let connection: Connection | null = null;

const mysqlDb = {
    async init() {
        try {
            connection = await mysql.createConnection({
                host: config.db.host,
                user: config.db.user,
                password: config.db.password,
                database: 'mysql',
            });
            console.log('Connected to MySQL');

            await this.resetDatabase();
            await this.createTables();
            await this.insertFixtures();

        } catch (error) {
            console.error('Error initializing database:', error);
        }
    },

    async resetDatabase() {
        try {
            await connection!.query('DROP SCHEMA IF EXISTS chat');
            console.log('Schema "chat" dropped');
            await connection!.query('CREATE SCHEMA chat COllATE utf8mb3_general_ci;');
            console.log('Schema "chat" created');
        } catch (error) {
            console.error('Error resetting database:', error);
        }
    },

    async createTables() {
        try {
            await connection!.query('USE chat');
            console.log('Using schema "chat"');

            await connection!.query(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(50) UNIQUE,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255),
          image VARCHAR(255),
          token VARCHAR(255),
          online BOOLEAN DEFAULT true
        );
      `);
            console.log('Table "users" created');
        } catch (error) {
            console.error('Error creating tables:', error);
        }
    },

    async insertFixtures() {
        try {
            const password1 = await bcrypt.hash('123', 10);
            const password2 = await bcrypt.hash('123', 10);

            await connection!.query(`
                INSERT INTO users (username, email, password, image, token, online)
                VALUES 
                    ('user1', 'user1@test.com', ?, '1.jpg', '123', true),
                    ('user2', 'user2@test.com', ?, '2.jpg', '12345', true);
            `, [password1, password2]);

            console.log('Fixtures inserted');
        } catch (error) {
            console.error('Error inserting fixtures:', error);
        }
    },
};

const run = async () => {
    await mysqlDb.init();
    if (connection) {
        await connection.end();
    }
};

run().catch(console.error);