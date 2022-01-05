import { Document } from "mongoose";

export interface Order extends Document {
  user: string;
  customer: string;
  orderItem: [
    items: {
      item: string;
      price: number;
      quantity: number;
    }
  ];
  total: number;
  status: string;
}
