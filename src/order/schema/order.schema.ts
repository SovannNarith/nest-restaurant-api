import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/config/mongoose-virtual-id';

export const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    orderItem: {
        type: Array,
        required: [true, 'Add items'],
        items: {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: [true, 'Please choose an item to make order']
            },
            price: {
                type: Number,
                required: [true, 'Add price of product']
            },
            quantity: {
                type: Number,
                required: [true, 'An item must be at 1 or later to make an order'],
            }
        }
    },
    total: {
        type: Number,
        required: [true, 'Can not calculate total of amount'],
        min: 1.00
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'CANCEL', 'PAID'],
        default: 'PENDING'
    }
}, {
    versionKey: false,
    timestamps: true
});

MongooseVirtualId.virtual(OrderSchema, 'orderId');