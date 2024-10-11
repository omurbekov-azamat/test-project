import cors from 'cors';
import express from 'express';
import mysqlDb from "./mysqlDb";
import usersRouter from "./routers/users";
import messagesRouter from "./routers/messages";
import groupsRouter from "./routers/groups";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/groups', groupsRouter);

const run = async () => {
    await mysqlDb.init();

    app.listen(port, () => {
        console.log('We are live on ' + port);
    })
};

run().catch(console.error);