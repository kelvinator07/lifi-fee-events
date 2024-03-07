import { expect } from 'chai';
import sinon from 'sinon';
import { IPaginateOptions, IPaginateResult } from 'typegoose-cursor-pagination';
import { FeeCollectedEventModel } from '../models/FeeCollectedEvent';
import { LastScannedBlockModel } from '../models/LastScannedBlock';
import EventRepository from '../repositories/event.repository';
import { START_BLOCK_NUMBER } from '../utils/constants';

const events = [
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

describe('EventRepository', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('saveMany', () => {

    it('should save multiple events successfully', async () => {        

      const insertManyStub = sinon.stub(FeeCollectedEventModel, 'insertMany').resolves();

      await EventRepository.saveMany(events);

      sinon.assert.calledOnce(insertManyStub);
      sinon.assert.calledWithExactly(insertManyStub, events);

      insertManyStub.restore();
    });

    it('should throw an error if saving events fails', async () => {

      const insertManyStub = sinon.stub(FeeCollectedEventModel, 'insertMany').rejects(new Error('Database error'));

      try {
        await EventRepository.saveMany(events);
      } catch (error: any) {
        expect(error.message).to.equal('Failed to create Event!');
      }

      sinon.assert.calledOnce(insertManyStub);
      sinon.assert.calledWithExactly(insertManyStub, events);

      insertManyStub.restore();
    });
  });

  describe('retrieveAll', () => {
    it('should retrieve all events successfully', async () => {
      const findStub = sinon.stub(FeeCollectedEventModel, 'find').resolves([]);

      const result = await EventRepository.retrieveAll();

      expect(result).to.deep.equal([]);

      sinon.assert.calledOnce(findStub);

      findStub.restore();
    });

    it('should throw an error if retrieval fails', async () => {
      const findStub = sinon.stub(FeeCollectedEventModel, 'find').rejects(new Error('Database error'));

      try {
        await EventRepository.retrieveAll();
      } catch (error: any) {
        expect(error.message).to.equal('Failed to retrieve Events!');
      }

      sinon.assert.calledOnce(findStub);

      findStub.restore();
    });
  });

  describe('retrieveAllByIntegratorAddress', () => {
    it('should retrieve events by integrator address successfully', async () => {
      const address = '0xCac60e91F8BF841Dd2c9A28E894fC6676A2AF892';
      const options: IPaginateOptions = {};
      const queryResult: IPaginateResult<any> = {
        docs: events,
        hasPrevious: false,
        hasNext: false,
        next: undefined,
        previous: undefined,
        totalDocs: 1,
      };

      const findPagedStub = sinon.stub(FeeCollectedEventModel, 'findPaged').resolves(queryResult);

      const result = await EventRepository.retrieveAllByIntegratorAddress(address, options);

      expect(result).to.deep.equal(queryResult);

      sinon.assert.calledOnceWithExactly(findPagedStub, options, { integrator: address });

      findPagedStub.restore();
    });

    it('should throw an error if retrieval fails', async () => {
      const address = '0xCac60e91F8BF841Dd2c9A28E894fC6676A2AF892';
      const options: IPaginateOptions = {};

      const findPagedStub = sinon.stub(FeeCollectedEventModel, 'findPaged').rejects(new Error('Database error'));

      try {
        await EventRepository.retrieveAllByIntegratorAddress(address, options);
      } catch (error: any) {
        expect(error.message).to.equal('Failed to retrieve Events!');
      }

      sinon.assert.calledOnceWithExactly(findPagedStub, options, { integrator: address });

      findPagedStub.restore();
    });
  });

  describe('retrieveLastScannedBlock', () => {
    it('should retrieve the last scanned block successfully', async () => {
      const lastScannedBlock = { blockNumber: 425672843 };

      const findOneStub = sinon.stub(LastScannedBlockModel, 'findOne').returns({
        sort: () => ({
            limit: () => lastScannedBlock
        })
      });

      const result = await EventRepository.retrieveLastScannedBlock();

      expect(result).to.equal(lastScannedBlock.blockNumber);

      sinon.assert.calledOnceWithExactly(findOneStub);
      
      findOneStub.restore();
    });

    it('should handle the case where there is no last scanned block and return a default value', async () => {
      const defaultBlockNumber = START_BLOCK_NUMBER;

      const findOneStub = sinon.stub(LastScannedBlockModel, 'findOne').returns({
        sort: () => ({
            limit: () => null
        })
      });

      const result = await EventRepository.retrieveLastScannedBlock();

      expect(result).to.equal(defaultBlockNumber);

      sinon.assert.calledOnceWithExactly(findOneStub);

      findOneStub.restore();
    });

    it('should throw an error if retrieval fails', async () => {
      const findOneStub = sinon.stub(LastScannedBlockModel, 'findOne').rejects(new Error('Database error'));

      try {
        await EventRepository.retrieveLastScannedBlock();
      } catch (error: any) {
        expect(error.message).to.equal('Failed to retrieve last scanned block!');
      }

      sinon.assert.calledOnce(findOneStub);

      findOneStub.restore();
    });
  });

  describe('saveLastScannedBlock', () => {
    it('should save the last scanned block successfully', async () => {
      const blockNumber = 425672843;
      const findOneAndUpdateResult = {};

      const findOneAndUpdateStub = sinon.stub(LastScannedBlockModel, 'findOneAndUpdate').resolves(findOneAndUpdateResult);

      const result = await EventRepository.saveLastScannedBlock(blockNumber);

      expect(result).to.equal(findOneAndUpdateResult);

      sinon.assert.calledOnceWithExactly(findOneAndUpdateStub, {}, { blockNumber }, { upsert: true, new: true });

      findOneAndUpdateStub.restore();
    });

    it('should throw an error if saving fails', async () => {
      const blockNumber = 425672843;

      const findOneAndUpdateStub = sinon.stub(LastScannedBlockModel, 'findOneAndUpdate').rejects(new Error('Database error'));

      try {
        await EventRepository.saveLastScannedBlock(blockNumber);
      } catch (error: any) {
        expect(error.message).to.equal('Failed to save last scanned block!');
      }

      sinon.assert.calledOnceWithExactly(findOneAndUpdateStub, {}, { blockNumber }, { upsert: true, new: true });

      findOneAndUpdateStub.restore();
    });
  });
});
