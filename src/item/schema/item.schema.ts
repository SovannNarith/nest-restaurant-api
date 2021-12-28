import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/config/mongoose-virtual-id';

export const ItemSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: [true, 'Add a name of Item'],
        maxlength: 50,
        minlength: 5
    },
    description: {
        type: String,
        required: [true, 'Please add a description for Item'],
        minlength: 20,
        maxlength: 150
    },
    price: {
        type: Number,
        required: [true, 'Please add a price of Item']
    },
    stockQty: {
        type: Number,
        required: [true, 'Please number of item in stock'],
        min: 0
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Categories',
        default: '61c29f0222c59d10843c341c'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: '61c280bb8c679e1775633fc7'
    },
    status: {
        type: String,
        enum: ['OUT_OF_STOCK', 'AVAILABLE']
    }
}, {
    versionKey: false,
    timestamps: true
});

MongooseVirtualId.virtual(ItemSchema, 'itemId');