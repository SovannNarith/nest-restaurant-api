import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/config/mongoose-virtual-id';

export const PaymentSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    method: {
        type: String,
        enum: ['Visa', 'Master Card', 'Cash'],
        required: [true, 'Please select a payment method']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '61c28e27104a50cc71b58fed'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: '61c2d81eb588865c7b09af74'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: '61c3f143c97bccda5f2661ae'
    },
    amount: {
        type: Number,
        required: [true, 'Please paid the order'],
        min: 1
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING'
    }
}, {
    versionKey: false,
    timestamps: true
});

MongooseVirtualId.virtual(PaymentSchema, 'paymentId');




