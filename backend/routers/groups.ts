import {Request, Response, Router} from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import mysqlDb from "../mysqlDb";

const groupsRouter = Router();

groupsRouter.get('/', auth, async (req: Request, res: Response) => {
    let connection;
    try {
        const reqWithUser = req as RequestWithUser;
        const userId = reqWithUser.user?.id!;
        connection = await mysqlDb.getConnection();

        const [groups]: [any[], any] = await connection.query(
            `SELECT g.id, g.name 
             FROM chat_groups g
             JOIN group_members gm ON g.id = gm.chat_group_id
             WHERE gm.user_id = ?`,
            [userId]
        );

        res.send(groups);
    } catch (e) {
        console.error('Error fetching users:', e);
        res.status(500).send({error: 'Internal server error'});
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default groupsRouter;