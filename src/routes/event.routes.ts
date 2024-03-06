import { Router } from 'express';
import EventController from '../controllers/event.controller';

class TutorialRoutes {
    router = Router();
    controller = new EventController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // Retrieve all Events
        this.router.get('/', this.controller.findAll);

        // Retrieve all Events for a specific integrator
        this.router.get('/integrator/:address', this.controller.findEventsByIntegratorAddress);
    }
}

export default new TutorialRoutes().router;
