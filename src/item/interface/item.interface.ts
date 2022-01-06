import { Document } from 'mongoose';

export interface Item extends Document {
  name: string;
  description: string;
  price: number;
  stockQty: number;
  categories: string[];
  createdBy: string;
  status: string;
}
