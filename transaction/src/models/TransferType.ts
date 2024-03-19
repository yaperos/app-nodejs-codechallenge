import {Schema, model, Document} from "mongoose"

export interface ITransferType extends Document {
    name: string;
    
}

const TransferTypeSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'name field is required'],
        unique: true
    },

}, {
    timestamps: true,
    versionKey: false
});


export const TransferTypeModel = model<ITransferType>('TransferType', TransferTypeSchema);