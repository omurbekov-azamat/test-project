import express, {Request, Response, NextFunction} from 'express';
import {FieldPacket, OkPacket, RowDataPacket} from 'mysql2';
import {promises as fs} from "fs";
import {imagesUpload} from '../multer';
import mysqlDb from '../mysqlDb';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const usersRouter = express.Router();

usersRouter.post('/', imagesUpload.single('image'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const connection = await mysqlDb.getConnection();
        const {email, username, password} = req.body;
        const image = req.file ? req.file.filename : null;

        const [existingUser]: any = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            res.status(400).json({username: 'Username already exists.'});
            return;
        }

        const [existingEmail]: any = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingEmail.length > 0) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            res.status(400).json({email: 'Email already exists'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.query<OkPacket>(
            'INSERT INTO users (email, password, username, image, online, token) VALUES (?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, username, image, true, crypto.randomUUID()],
        );

        if (result.affectedRows > 0) {
            const user = {
                id: result.insertId,
                email,
                username,
                image,
                online: true,
                token: crypto.randomUUID(),
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

        const [rows]: [RowDataPacket[], any] = await connection.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
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
        await connection.query('UPDATE users SET online = ?, token = ? WHERE id = ?', [true, token, findUser.id]);

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

usersRouter.delete('/sessions', async (req, res, next) => {
    let connection;
    try {
        const token = req.get('Authorization');
        const success = {message: 'Success'};

        if (!token) {
            res.send(success);
            return;
        }

        connection = await mysqlDb.getConnection();

        const [userResult, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query('SELECT * FROM users WHERE token = ?', [token]);

        const user = userResult[0];

        if (!user) {
            res.send(success);
            return;
        }

        const newToken = crypto.randomUUID();
        await connection.query('UPDATE users SET online = ?, token = ? WHERE id = ?', [false, newToken, user.id]);

        res.send(success);
        return;
    } catch (e) {
        return next(e);
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

usersRouter.get('/', async (req, res) => {
    let connection;

    try {
        connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM users');
        res.send(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({error: 'Internal server error'});
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default usersRouter;