import { Request, Response } from "express";
import { IPaginateOptions } from "typegoose-cursor-pagination";
import { ParsedFeeCollectedEvent } from "../models/ParsedFeeCollectedEvent";
import parsedEventRepository from "../repositories/event.repository";

export default class EventController {
    async create(req: Request, res: Response) {
        if (
            !req.body.token ||
            !req.body.integrator ||
            !req.body.integratorFee ||
            !req.body.lifiFee
        ) {
            res.status(400).send({
                message: "Missing field!",
            });
            return;
        }

        const parsedEvent: ParsedFeeCollectedEvent = req.body;

        try {
            const newEvent: ParsedFeeCollectedEvent = await parsedEventRepository.save(parsedEvent);
            res.status(201).send(newEvent);
        } catch (err) {
            res.status(500).send({
                message: "Some error occurred while creating event.",
            });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const allEvents: ParsedFeeCollectedEvent[] = await parsedEventRepository.retrieveAll();
            res.status(200).send(allEvents);
        } catch (err) {
            res.status(500).send({
                message: "Some error occurred while retrieving Events.",
            });
        }
    }

    async findOne(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const event: ParsedFeeCollectedEvent | null = await parsedEventRepository.retrieveById(id);
            if (event) {
                res.status(200).send(event);
            } else {
                res.status(404).send({
                    message: `Cannot find Event with id=${id}.`,
                });
            }
        } catch (err) {
            res.status(500).send({
                message: `Error retrieving Event with id=${id}.`,
            });
        }
    }

    async findEventsByIntegratorAddress(req: Request, res: Response) {
        const { address } = req.params;

        const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;
        if (!ethAddressPattern.test(address)) {
            res.status(400).json({ message: 'Invalid Integrator Ethereum address format' });
        }

        const { limit, next } = req.query;
        
        const options: IPaginateOptions = {
            sortField: "_id",
            sortAscending: true,
            limit: parseInt(limit as string, 10) || 10, // If "limit" is not sent we will default it to 10.
            next: next as string
        };

        try {
            const result = await parsedEventRepository.retrieveAllByIntegratorAddress(address, options);
            const {docs: events, hasPrevious, hasNext, next, previous, totalDocs: totalEvents} = result;
            res.status(200).send({ events, hasPrevious, hasNext, next, previous, totalEvents });
        } catch (err) {
            res.status(500).send({
                message: `Error retrieving Event with id = ${address}.`,
            });
        }
    }
}
