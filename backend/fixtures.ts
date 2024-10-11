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
                    online BOOLEAN DEFAULT false,
                    is_admin BOOLEAN DEFAULT false
                );
            `);

            await connection!.query(`
                CREATE TABLE chat_groups (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);

            await connection!.query(`
                CREATE TABLE group_members (
                    chat_group_id INT NOT NULL,
                    user_id INT NOT NULL,
                    FOREIGN KEY (chat_group_id) REFERENCES chat_groups(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    PRIMARY KEY (chat_group_id, user_id)
                )
            `);

            await connection!.query(`
                CREATE TABLE messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    sender_id INT NOT NULL,
                    receiver_id INT NULL,
                    chat_group_id INT NULL,
                    text TEXT,
                    image VARCHAR(255),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (chat_group_id) REFERENCES chat_groups(id) ON DELETE CASCADE
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
                    INSERT INTO users (username, email, password, image, token, online, is_admin)
                    VALUES (?, ?, ?, ?, ?, ?, ?),(?, ?, ?, ?, ?, ?, ?),(?, ?, ?, ?, ?, ?, ?),
                    (?, ?, ?, ?, ?, ?, ?);`, [
                    'user1', 'user1@test.com', password1, '1.jpg', '123', false, false,
                    'user2', 'user2@test.com', password1, '2.jpg', '1234', false, false,
                    'user3', 'user3@test.com', password1, '3.jpg', '12345', false, false,
                    'admin', 'admin@gmail.com', password1, '3.jpg', '123456', false, true]);

            await connection!.query(`
                    INSERT INTO chat_groups (name) VALUES ('Family Group'), ('Friends Group');
            `);

            await connection!.query(`
                    INSERT INTO group_members (chat_group_id, user_id)
                    VALUES (1, 1), (1, 2), (2, 1), (2, 3);
            `);

            await connection!.query(`
                INSERT INTO messages (sender_id, receiver_id, text, chat_group_id, image)
                VALUES 
                    (1, 2, 'Hello, how are you?', NULL, NULL),
                    (2, 1, 'I am good, thank you!', NULL, NULL),
                    (2, 1, 'What about you?', NULL, NULL),
                    (1, NULL,'Hi Family', 1,  NULL),
                    (1, NULL, 'Hi Friends', 2,  NULL),
                    (3, 1, NULL, NULL,'fixtures/img1.jpg')`,
            );

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