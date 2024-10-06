import cors from 'cors';
import express from 'express';
import mysqlDb from "./mysqlDb";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const run = async () => {
    await mysqlDb.init();

    app.listen(port, () => {
        console.log('We are live on ' + port);
    })
};

run().catch(console.error);