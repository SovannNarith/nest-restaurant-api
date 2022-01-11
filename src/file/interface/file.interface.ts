import { Document } from 'mongoose';

export interface File extends Document {
  originalName: string;
  buffer: Buffer;
  path: string;
  key: string;
}
