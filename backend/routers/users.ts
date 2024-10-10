import express, {Request, Response, NextFunction} from 'express';
import {OkPacket, RowDataPacket} from 'mysql2';
import {promises as fs} from "fs";
import {imagesUpload} from '../multer';
import mysqlDb from '../mysqlDb';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import auth, {RequestWithUser} from "../middleware/auth";
import {IUser} from "../types";

const usersRouter = express.Router();

usersRouter.post('/', imagesUpload.single('image'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const connection = await mysqlDb.getConnection();
        const {email, username, password} = req.body;
        const image = req.file ? req.file.filename : null;

        const [existingUser]: any = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            res.status(400).json({username: 'Username already exists.'});
            return;
        }

        const [existingEmail]: any = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingEmail.length > 0) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            res.status(400).json({email: 'Email already exists'});
            return;
        }

        const token = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.query<OkPacket>(
            'INSERT INTO users (email, password, username, image, online, token) VALUES (?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, username, image, true, token],);

        if (result.affectedRows > 0) {
            const user = {
                id: result.insertId,
                email,
                username,
                image,
                online: true,
                token: token,
            };

            res.status(201).json({
                message: 'User created successfully',
                user,
            });
            return;
        } else {
            res.status(400).json({error: 'User creation failed'});
            return;
        }
    } catch (error: any) {
        console.error('Error creating user:', error);
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    let connection;

    try {
        connection = await mysqlDb.getConnection();

        const [rows]: [RowDataPacket[], any] = await connection.query('SELECT * FROM users WHERE email = ?',
            [req.body.email]);
        const findUser = rows[0] as RowDataPacket;

        if (!findUser) {
            res.status(400).send({email: 'Email is not found!'});
            return;
        }

        const isMatch = await bcrypt.compare(req.body.password, findUser.password);

        if (!isMatch) {
            res.status(400).send({password: 'Password is wrong'});
            return;
        }

        const token = crypto.randomUUID();
        await connection.query('UPDATE users SET online = ?, token = ? WHERE id = ?',
            [true, token, findUser.id]);

        const {id, email, username, image} = findUser;
        const user = {id, email, username, image, online: true, token};

        res.send({message: 'Username and password correct', user});
        return;
    } catch (error) {
        return next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

usersRouter.delete('/sessions', auth, async (req: Request, res: Response, next: NextFunction) => {
    let connection;

    try {
        const success = {message: 'Success'};
        const user = (req as RequestWithUser).user;
        connection = await mysqlDb.getConnection();
        const newToken = crypto.randomUUID();

        await connection.query('UPDATE users SET online = ?, token = ? WHERE id = ?',
            [false, newToken, user?.id]);

        res.send(success);
    } catch (e) {
        return next(e);
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

usersRouter.get('/', auth, async (req: Request, res: Response) => {
    let connection;

    try {
        const reqWithUser = req as RequestWithUser;
        const user = reqWithUser.user;
        connection = await mysqlDb.getConnection();

        const [users]: [RowDataPacket[], any] = await connection.query<RowDataPacket[]>(
            `SELECT DISTINCT u.id, u.username, u.token, u.image, u.online FROM users u
                JOIN messages m ON (u.id = m.receiver_id OR u.id = m.sender_id)
                WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?`,
            [user?.id, user?.id, user?.id]);

        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({error: 'Internal server error'});
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

usersRouter.patch('/password', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let connection;

    try {
        const reqWithUser = req as RequestWithUser;
        const user = reqWithUser.user;

        if (!user) {
            res.status(401).send({error: 'User not authenticated'});
        }

        const {newPassword} = req.body;

        if (!newPassword) {
            res.status(400).send({error: 'New password is required'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        connection = await mysqlDb.getConnection();
        await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user?.id]);

        res.send({message: 'Password changed successfully'});
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

usersRouter.post('/addUser', auth, async (req: Request, res: Response) => {
    let connection;
    try {
        const reqWithUser = req as RequestWithUser;
        const user = reqWithUser.user;
        connection = await mysqlDb.getConnection();
        const senderId = user?.id!;

        const [rows]: [RowDataPacket[], any] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [req.body.username]
        );
        const findUser = rows[0] as IUser;

        if (!findUser) {
            res.send({message: 'Username is not found!'});
            return;
        }

        const [existingMessages]: [RowDataPacket[], any] = await connection.query(
            'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
            [senderId, findUser.id, findUser.id, senderId]
        );

        if (existingMessages.length > 0) {
            res.send({message: 'Message between these users already exists'});
            return;
        }

        await connection.query(
            'INSERT INTO messages (sender_id, receiver_id, text) VALUES (?, ?, ?)',
            [senderId, findUser.id, 'Hello']
        );
        res.send({message: 'Message sent successfully'});
    } catch (e) {
        console.error('Error fetching users:', e);
        res.status(500).send({error: 'Internal server error'});
    } finally {
        if (connection) {
            connection.release();
        }
    }
})

export default usersRouter;