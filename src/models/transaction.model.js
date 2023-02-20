const mongoose = require("mongoose");
const { Schema } = mongoose;


let StatusEnum = {
  values: [
    1, 2, 3
  ],
  message: "{VALUE} is not a valid status",
};

const transactionSchema = new Schema(
  {
    _id: {
      type: Schema.ObjectId,      
      auto: true
    },
    accountExternalIdDebit: {
      type: String,
    },
    accountExternalIdCredit: {
      type: String,
    },
    value: {
      type: mongoose.Types.Decimal128,
      default: 0,
    },
    tranferTypeId: {
      type: Number,
      default: 1,
    },   
    tranferStatusId: {
      type: Number,
      default: 1,
      enum: StatusEnum,
    },   
   
    } ,
    { timestamps: true } 
);

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
