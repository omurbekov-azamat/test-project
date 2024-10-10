import {NextFunction, Request, Response} from 'express';
import mysqlDb from '../mysqlDb';
import {RowDataPacket} from 'mysql2/promise';
import {IUser} from '../types';

export interface RequestWithUser extends Request {
    user?: Pick<IUser, 'id' | 'email' | 'username' | 'token' | 'is_admin'>;
}

const auth = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    let connection;
    const token = req.get('Authorization');

    if (!token) {
        res.status(401).send({error: 'No token'});
        return;
    }

    try {
        connection = await mysqlDb.getConnection();

        const [rows]: [RowDataPacket[], any] = await connection.query(
            'SELECT * FROM users WHERE token = ?',
            [token]
        );

        if (rows.length === 0) {
            res.status(401).send({error: 'Wrong token!'});
            return;
        }

        const user = rows[0] as IUser;

        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            token: user.token,
            is_admin: user.is_admin,
        };

        next();
    } catch (error) {
        res.status(500).send({error: 'Internal server error'});
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export default auth;