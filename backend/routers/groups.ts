import {Request, Response, Router} from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import mysqlDb from "../mysqlDb";

const groupsRouter = Router();

groupsRouter.get('/', auth, async (req: Request, res: Response) => {
    let connection;
    try {
        const reqWithUser = req as RequestWithUser;
        const userId = reqWithUser.user?.id!;
        const isAdmin = reqWithUser.user?.is_admin;
        connection = await mysqlDb.getConnection();

        let groups;

        if (isAdmin) {
            [groups] = await connection.query(
                `SELECT id, name FROM chat_groups`
            );
        } else {
            [groups] = await connection.query(
                `SELECT g.id, g.name 
                 FROM chat_groups g
                 JOIN group_members gm ON g.id = gm.chat_group_id
                 WHERE gm.user_id = ?`,
                [userId]
            );
        }
        res.send(groups);
    } catch (e) {
        console.error('Error fetching groups:', e);
        res.status(500).send({error: 'Internal server error'});
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

groupsRouter.get('/:id', async (req: Request, res: Response) => {
    const groupId = req.params.id;
    let connection;

    try {
        connection = await mysqlDb.getConnection();

        const [messages]: [any[], any] = await connection.query(`
            SELECT m.id AS message_id, m.sender_id, m.text AS message_text, m.image AS message_image,
                   u.username AS sender_username,
                   DATE_FORMAT(m.created_at, '%d/%m/%y %H:%i') AS created_at
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.chat_group_id = ?
            ORDER BY m.created_at;
        `, [groupId]);

        const [users]: [any[], any] = await connection.query(`
            SELECT DISTINCT u.id AS user_id, u.username
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.chat_group_id = ?;
        `, [groupId]);

        res.send({
            groupId,
            messages: messages.map((msg) => ({
                message_id: msg.message_id,
                sender_id: msg.sender_id,
                sender_name: msg.sender_username,
                text: msg.message_text,
                created_at: msg.created_at,
                image: msg.message_image,
            })),
            users: users.map((user) => ({
                userId: user.user_id,
                username: user.username,
            })),
        });
    } catch (error) {
        console.error('Error fetching messages and users:', error);
        res.status(500).send({ error: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default groupsRouter;