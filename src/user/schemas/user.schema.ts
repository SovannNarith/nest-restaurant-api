import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
import { MongooseVirtualId } from 'src/advanced/mongoose-virtual-id';

export const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      minlength: 6,
      maxlength: 30,
      required: [true, 'Name can not BLANK'],
    },
    email: {
      type: String,
      lowercase: true,
      validate: validator.isEmail,
      required: [true, 'Email can not BLANK'],
      unique: true,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: [true, 'Password can not BLANK'],
      select: false,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
    image: {
      type: String,
      default: '44bd0d5c-a5fa-44bb-9a6b-d1fcbdb823a0',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

MongooseVirtualId.virtual(UserSchema, 'userId');

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    next(err);
  }
});
