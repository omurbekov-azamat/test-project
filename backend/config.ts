import path from 'path';

const rootPath = __dirname;

const config = {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    db: {
        host: 'localhost',
        user: 'root',
        password: '123456789',
        database: 'chat',
    },
};

export default config;