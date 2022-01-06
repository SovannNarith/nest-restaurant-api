import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/advanced/mongoose-virtual-id';

export const PaymentSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    method: {
      type: String,
      enum: ['Visa', 'Master Card', 'Cash'],
      required: [true, 'Please select a payment method'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    amount: {
      type: Number,
      required: [true, 'Please paid the order'],
      min: 1,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

MongooseVirtualId.virtual(PaymentSchema, 'paymentId');
