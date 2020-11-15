import mongoose from 'mongoose';

let schema = mongoose.Schema({
  description: String,
  value: Number,
  category: String,
  year: Number,
  month: Number,
  day: Number,
  yearMonth: String,
  yearMonthDay: String,
  type: String,
});
//remove o __v e transforma o _id em id
schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const TransactionModel = mongoose.model('transactions', schema, 'transactions');

export { TransactionModel };
