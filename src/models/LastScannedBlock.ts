import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true, versionKey: false } })
class LastScannedBlock {
    @prop({ required: true })
    public blockNumber!: number;
}

const LastScannedBlockModel = getModelForClass(LastScannedBlock);

export { LastScannedBlock, LastScannedBlockModel };
