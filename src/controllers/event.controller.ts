import { Request, Response } from 'express';
import { IPaginateOptions } from 'typegoose-cursor-pagination';
import { FeeCollectedEvent } from '../models/FeeCollectedEvent';
import eventRepository from '../repositories/event.repository';
import { STATUS, STATUSCODE, successResponse, errorResponse } from '../utils/response';

export default class EventController {
    async findAll(req: Request, res: Response) {
        try {
            const allEvents: FeeCollectedEvent[] = await eventRepository.retrieveAll();
            res.status(STATUSCODE.OK).json(successResponse(STATUS.SUCCESS, allEvents));
        } catch (err) {
            res.status(STATUSCODE.SERVER).json(
                errorResponse(STATUS.ERROR, 'Some error occurred while retrieving Events.')
            );
        }
    }

    async findEventsByIntegratorAddress(req: Request, res: Response) {
        const { address } = req.params;

        const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;
        if (!ethAddressPattern.test(address)) {
            res.status(STATUSCODE.BAD_REQUEST).json(
                errorResponse(STATUS.ERROR, 'Invalid Integrator Ethereum address format.')
            );
            return;
        }

        const { limit, next } = req.query;

        const options: IPaginateOptions = {
            sortField: '_id',
            sortAscending: true,
            limit: parseInt(limit as string, 10) || 10, // If "limit" is not sent we will default it to 10.
            next: next as string,
        };

        try {
            const result = await eventRepository.retrieveAllByIntegratorAddress(address, options);
            const { docs: events, hasPrevious, hasNext, next, previous, totalDocs: totalEvents } = result;
            res.status(STATUSCODE.OK).json(
                successResponse(STATUS.SUCCESS, {
                    events,
                    hasPrevious,
                    hasNext,
                    next,
                    previous,
                    totalEvents,
                })
            );
            return;
        } catch (err) {
            res.status(STATUSCODE.SERVER).json(
                errorResponse(STATUS.ERROR, `Error retrieving Event with id = ${address}.`)
            );
        }
    }
}
