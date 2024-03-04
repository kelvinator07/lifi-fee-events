import paginationPlugin, { PaginateModel } from 'typegoose-cursor-pagination';
import { prop, getModelForClass, modelOptions, plugin } from "@typegoose/typegoose";
import mongoose from "mongoose";

// @index({ email: 1 })
@modelOptions({ schemaOptions: { timestamps: true, versionKey: false } })
@plugin(paginationPlugin)
class ParsedFeeCollectedEvent {
    @prop({ required: true })
    public token!: string; // the address of the token that was collected

    @prop({ required: true, index: true })
    public integrator!: string; // the integrator that triggered the fee collection

    @prop({ required: true })
    public integratorFee!: BigInt; // the share collector for the integrator
    
    @prop({ required: true })
    public lifiFee!: BigInt; // the share collected for lifi
}

const ParsedFeeCollectedEventModel = getModelForClass(ParsedFeeCollectedEvent, { existingMongoose: mongoose }) as PaginateModel<ParsedFeeCollectedEvent, typeof ParsedFeeCollectedEvent>;

export { ParsedFeeCollectedEvent, ParsedFeeCollectedEventModel };
