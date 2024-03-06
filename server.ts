import express, { Application, Request, Response } from 'express';
import Server from './src/index';
import { PORT } from './src/utils/constants';
import logger from './src/utils/logger';

const app: Application = express();
new Server(app);

app.get('/', async (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Welcome api' })
})

app.listen(PORT, 'localhost', async () => {
    logger.info(`Server is running on port ${PORT}.`);
}).on('error', (err: Error) => {
    if (err.name === 'EADDRINUSE') {
        logger.info('Error: address already in use');
    } else {
        logger.info(err);
    }
});
