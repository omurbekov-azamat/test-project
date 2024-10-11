import auth, {RequestWithUser} from "../middleware/auth";
import express from "express";
import mysqlDb from "../mysqlDb";
import {imagesUpload} from "../multer";
import {OkPacket, RowDataPacket} from "mysql2";
import {IMessage} from "../types";

const messagesRouter = express.Router();

messagesRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const reqWithUser = req as RequestWithUser;
        const user = reqWithUser.user;
        const senderId = user?.id!;
        const {text, receiver_id, chat_group_id} = req.body;
        const image = req.file ? req.file.filename : null;

        let result;

        if (receiver_id) {
            [result] = await connection.query<OkPacket>(
                'INSERT INTO messages (sender_id, receiver_id, text, image) VALUES (?, ?, ?, ?)',
                [senderId, receiver_id, text, image]
            );
        } else if (chat_group_id) {
            [result] = await connection.query<OkPacket>(
                'INSERT INTO messages (sender_id, receiver_id, chat_group_id, text, image) VALUES (?, NULL, ?, ?, ?)',
                [senderId, chat_group_id, text, image]
            );
        } else {
            res.status(400).send({message: 'Either receiver_id or chat_group_id must be provided.'});
            return;
        }
        res.status(201).send({message: 'Message created successfully', messageId: result.insertId});
    } catch (e) {
        console.error('Error creating message:', e);
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
            res.status(400).json({error: 'Invalid recipient ID'});
            return;
        }

        const [messages]: [any[], any] = await connection!.query(`
            SELECT m.sender_id, m.receiver_id, m.text, m.image, m.id,
                   u.username AS sender_name,
                   DATE_FORMAT(m.created_at, '%d/%m/%y %H:%i') AS created_at
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?)
            OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.created_at ASC`,
            [senderId, recipientId, recipientId, senderId]);

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({error: 'Internal Server Error'});
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default messagesRouter;