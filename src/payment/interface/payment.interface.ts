import { Document } from "mongoose";

export interface Payment extends Document {
  method: string;
  user: string;
  customer: string;
  order: string;
  amount: number;
  status: string;
}
