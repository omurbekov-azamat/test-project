import { NextFunction, Request, Response } from 'express';
import mysqlDb from '../mysqlDb';
import { RowDataPacket } from 'mysql2/promise';
import { IUser } from '../types';

export interface RequestWithUser extends Request {
    user: Pick<IUser, 'id' | 'email' | 'username' | 'token'>;
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
    let connection;
    const req = expressReq as RequestWithUser;
    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).send({ error: 'No token' });
    }

    try {
        connection = await mysqlDb.getConnection();

        const [rows]: [RowDataPacket[], any] = await connection.query(
            'SELECT * FROM users WHERE token = ?',
            [token]
        );

        if (rows.length === 0) {
            return res.status(401).send({ error: 'Wrong token!' });
        }

        const user = rows[0] as IUser;

        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            token: user.token,
        };

        return next();
    } catch (error) {
        return res.status(500).send({ error: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export default auth;
