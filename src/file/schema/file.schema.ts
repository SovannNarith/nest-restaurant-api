import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/advanced/mongoose-virtual-id';

export const FileSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    originalName: {
      type: String,
      required: [true, 'FIle name required'],
    },
    buffer: Buffer,
    path: {
      type: String,
      required: [true, 'Path to get File'],
    },
    key: {
      type: String,
      required: [true, 'A Unique Key of a file'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

MongooseVirtualId.virtual(FileSchema, 'fileId');
