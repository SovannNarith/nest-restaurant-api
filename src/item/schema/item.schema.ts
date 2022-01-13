import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/advanced/mongoose-virtual-id';

export const ItemSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: [true, 'Add a name of Item'],
      maxlength: 50,
      minlength: 5,
    },
    description: {
      type: String,
      required: [true, 'Please add a description for Item'],
      minlength: 20,
      maxlength: 150,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price of Item'],
    },
    stockQty: {
      type: Number,
      required: [true, 'Please number of item in stock'],
      min: 0,
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Categories',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    status: {
      type: String,
      enum: ['OUT_OF_STOCK', 'AVAILABLE'],
    },
    image: {
      type: String,
      default: '091f422d-c2a2-4cd4-a9dc-7594d1fb28e6',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

MongooseVirtualId.virtual(ItemSchema, 'itemId');
