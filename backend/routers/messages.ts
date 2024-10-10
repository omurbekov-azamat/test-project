import auth, { RequestWithUser } from "../middleware/auth";
import express from "express";
import mysqlDb from "../mysqlDb";
import {imagesUpload} from "../multer";
import {OkPacket, RowDataPacket} from "mysql2";
import {IMessage} from "../types";

const messagesRouter = express.Router();

type MessageRow = IMessage & RowDataPacket;

messagesRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const reqWithUser = req as RequestWithUser;
        const user = reqWithUser.user;
        const senderId = user?.id!;
        const {text, receiver_id} = req.body;
        const image = req.file ? req.file.filename : null;

        const [result] = await connection.query<OkPacket>(
            'INSERT INTO messages (sender_id, receiver_id, text, image) VALUES (?, ?, ?, ?)',
            [senderId, receiver_id, text, image],);

        res.status(201).send({message: 'Message created successfully', messageId: result.insertId});
        return;
    } catch (e) {
        console.error('Error creating user:', e);
        next(e);
    }
});

messagesRouter.get('/:id', auth, async (req, res) => {
    let connection;

    try {
        connection = await mysqlDb.getConnection();
        const recipientId = parseInt(req.params.id);
        const reqWithUser = req as RequestWithUser;
        const user = reqWithUser.user;
        const senderId = user?.id!;

        if (!recipientId || isNaN(recipientId)) {
            res.status(400).json({ error: 'Invalid recipient ID' });
            return;
        }

        const [messages]: [MessageRow[], any] = await connection!.query(`
            SELECT sender_id, receiver_id, text, image, id,
            DATE_FORMAT(created_at, '%d/%m/%y %H:%i') AS created_at
            FROM messages WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC`,
            [senderId, recipientId, recipientId, senderId]);

         res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default messagesRouter;