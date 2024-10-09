import mysql, {Connection} from 'mysql2/promise';
import config from './config';
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
            await connection!.query('CREATE SCHEMA chat COLLATE utf8mb3_general_ci;');
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

            await connection!.query(`
                CREATE TABLE messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    sender_id INT NOT NULL,
                    receiver_id INT NULL,
                    text TEXT,
                    image VARCHAR(255),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `);

            console.log('Tables "users" and "messages" created');
        } catch (error) {
            console.error('Error creating tables:', error);
        }
    },

    async insertFixtures() {
        try {
            const password1 = await bcrypt.hash('123', 10);

            await connection!.query(`
                INSERT INTO users (username, email, password, image, token, online)
                VALUES 
                    ('user1', 'user1@test.com', ?, '1.jpg', '123', true),
                    ('user2', 'user2@test.com', ?, '2.jpg', '1234', true),
                    ('user3', 'user3@test.com', ?, '3.jpg', '12345', true);
            `, [password1, password1, password1]);

            await connection!.query(`
                INSERT INTO messages (sender_id, receiver_id, text, image)
                VALUES 
                    (1, 2, 'Hello, how are you?', NULL),
                    (2, 1, 'I am good, thank you!', NULL),
                    (2, 1, 'What about you?', NULL),
                    (3, 1, NULL, '4.jpg')
            `);

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