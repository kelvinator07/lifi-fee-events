import { Request, Response } from 'express';
import sinon from 'sinon';
import { expect } from 'chai';
import { describe } from 'mocha';
import { STATUS, STATUSCODE, successResponse, errorResponse } from '../utils/response';

import EventController from './event.controller';
import EventRespository from '../repositories/event.repository';

describe('EventController', () => {
    describe('findEventsByIntegratorAddress', () => {
        it('should handle a valid Ethereum address and retrieve events successfully', async () => {
            const address = '0xCac60e91F8BF841Dd2c9A28E894fC6676A2AF892';
            const limit = '5';
            const next = 'nextToken';

            const req = {
                params: { address },
                query: { limit, next },
            } as unknown as Request;

            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
                json: sinon.stub(),
            } as unknown as Response;

            const eventData = [
                {
                    _id: '65e77da31bf83830b1f2c92a',
                    token: '0x0000000000000000000000000000000000000000',
                    integrator: '0xCac60e91F8BF841Dd2c9A28E894fC6676A2AF892',
                    integratorFee: '425000000000000000',
                    lifiFee: '75000000000000000',
                    createdAt: '2024-03-05T20:16:35.613Z',
                    updatedAt: '2024-03-05T20:16:35.613Z',
                },
                {
                    _id: '65e77da41bf83830b1f2c92d',
                    token: '0x0000000000000000000000000000000000000000',
                    integrator: '0xCac60e91F8BF841Dd2c9A28E894fC6676A2AF892',
                    integratorFee: '425000000000000000',
                    lifiFee: '75000000000000000',
                    createdAt: '2024-03-05T20:16:35.613Z',
                    updatedAt: '2024-03-05T20:16:35.613Z',
                },
                {
                    _id: '65e77d111bf83830b1f2c87c',
                    token: '0x0000000000000000000000000000000000000000',
                    integrator: '0xCac60e91F8BF841Dd2c9A28E894fC6676A2AF892',
                    integratorFee: '134509949305090',
                    lifiFee: '23737049877368',
                    createdAt: '2024-03-05T20:16:35.613Z',
                    updatedAt: '2024-03-05T20:16:35.613Z',
                },
            ];

            const responseData = {
                events: eventData,
                hasPrevious: false,
                hasNext: false,
                next: undefined,
                previous: undefined,
                totalEvents: eventData.length,
            };

            const returnData = successResponse(STATUS.SUCCESS, responseData);

            const retrieveAllByIntegratorAddressStub = sinon.stub(
                EventRespository,
                'retrieveAllByIntegratorAddress'
            ).resolves({
                docs: eventData,
                hasPrevious: false,
                hasNext: false,
                next: undefined,
                previous: undefined,
                totalDocs: eventData.length,
            });

            await new EventController().findEventsByIntegratorAddress(req, res);

            expect(
                retrieveAllByIntegratorAddressStub.calledOnceWithExactly(address, {
                    sortField: '_id',
                    sortAscending: true,
                    limit: 5,
                    next: 'nextToken',
                })
            ).to.be.true;

            sinon.assert.calledWith(res.status as sinon.SinonSpy, STATUSCODE.OK);
            sinon.assert.calledOnceWithExactly(res.json as sinon.SinonSpy, returnData);

            retrieveAllByIntegratorAddressStub.restore();
        });

        it('should handle an invalid Ethereum address and return a 400 response', async () => {
            const address = 'InvalidAddress';

            const req = {
                params: { address },
            } as unknown as Request;

            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
                json: sinon.stub(),
            } as unknown as Response;

            await new EventController().findEventsByIntegratorAddress(req, res);

            sinon.assert.calledWith(res.status as sinon.SinonSpy, STATUSCODE.BAD_REQUEST);
            sinon.assert.calledOnce(res.json as sinon.SinonSpy);
            sinon.assert.calledWithMatch(
                res.json as sinon.SinonSpy,
                errorResponse(STATUS.ERROR, `Invalid Integrator Ethereum address format.`)
            );
        });

        it('should handle an error during event retrieval and return a 500 response', async () => {
            const address = '0xCac60e91F8BF841Dd2c9A28E894fC6676A2AF892';

            const req = {
                params: { address },
                query: {},
            } as unknown as Request;

            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
                json: sinon.stub(),
            } as unknown as Response;

            const retrieveAllByIntegratorAddressStub = sinon.stub(
                EventRespository,
                'retrieveAllByIntegratorAddress'
            ).rejects(new Error('Database error'));

            await new EventController().findEventsByIntegratorAddress(req, res);

            expect(
                retrieveAllByIntegratorAddressStub.calledOnceWithExactly(address, {
                    sortField: '_id',
                    sortAscending: true,
                    limit: 10,
                    next: undefined,
                })
            ).to.be.true;

            sinon.assert.calledWith(res.status as sinon.SinonSpy, STATUSCODE.SERVER);
            sinon.assert.calledOnce(res.json as sinon.SinonSpy);
            sinon.assert.calledWithMatch(
                res.json as sinon.SinonSpy,
                errorResponse(STATUS.ERROR, `Error retrieving Event with id = ${address}.`)
            );

            retrieveAllByIntegratorAddressStub.restore();
        });
    });
});
