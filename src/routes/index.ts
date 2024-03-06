import { Application } from 'express';
import eventRoutes from './event.routes';

export default class Routes {
    constructor(app: Application) {
        app.use('/api/v1/events', eventRoutes);
    }
}
