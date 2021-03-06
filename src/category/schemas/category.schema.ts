import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/advanced/mongoose-virtual-id';

export const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please add a name of category'],
      minlength: 5,
      maxlength: 30,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

MongooseVirtualId.virtual(CategorySchema, 'categoryId');
