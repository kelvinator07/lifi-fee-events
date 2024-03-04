import { Router } from "express";
import EventController from "../controllers/event.controller";

class TutorialRoutes {
  router = Router();
  controller = new EventController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Event
    this.router.post("/", this.controller.create);

    // Retrieve all Events
    this.router.get("/", this.controller.findAll);

    // Retrieve a single Event with id
    this.router.get("/:id", this.controller.findOne);

    // Retrieve all Events for a specific integrator
    this.router.get("/integrator/:address", this.controller.findEventsByIntegratorAddress);
  }
}

export default new TutorialRoutes().router;
