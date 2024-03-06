import paginationPlugin, { PaginateModel } from 'typegoose-cursor-pagination';
import { Severity, prop, getModelForClass, modelOptions, plugin } from '@typegoose/typegoose';
import mongoose from 'mongoose';

@modelOptions({
    schemaOptions: { timestamps: true, versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
@plugin(paginationPlugin)
class FeeCollectedEvent {
    @prop({ required: true })
    public token!: string; // the address of the token that was collected

    @prop({ required: true, index: true })
    public integrator!: string; // the integrator that triggered the fee collection

    @prop({ required: true })
    public integratorFee!: string; // the share collector for the integrator

    @prop({ required: true })
    public lifiFee!: string; // the share collected for lifi
}

const FeeCollectedEventModel = getModelForClass(FeeCollectedEvent, {
    existingMongoose: mongoose,
}) as PaginateModel<FeeCollectedEvent, typeof FeeCollectedEvent>;

export { FeeCollectedEvent, FeeCollectedEventModel };
