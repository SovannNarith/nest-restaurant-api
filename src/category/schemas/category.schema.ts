import * as mongoose from 'mongoose';
import { MongooseVirtualId } from 'src/config/mongoose-virtual-id';

export const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name of category'],
        minlength: 5,
        maxlength: 30
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

MongooseVirtualId.virtual(CategorySchema, 'categoryId');