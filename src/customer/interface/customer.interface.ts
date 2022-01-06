import { Document } from 'mongoose';

export interface Customer extends Document {
  fullname: string;
  phone: string;
}
