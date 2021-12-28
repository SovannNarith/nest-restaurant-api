import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/config/mongoose-virtual-id';

const phoneRegex = /\b855 *[-(]? *[0-9]{2} *[-)]? *[0-9]{3} *[-]? *[0-9]{3,4}\b|\b00855 *[-(]? *[0-9]{2} *[-)]? *[0-9]{3} *[-]? *[0-9]{3,4}\b/

export const CustomerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please add a name of Customer'],
        minlength: 5,
        maxlength: 30
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
        match: phoneRegex,
        maxlength: 12
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '61c28e27104a50cc71b58fed'
    }
}, {
    versionKey: false,
    timestamps: true
});

MongooseVirtualId.virtual(CustomerSchema, 'customerId');