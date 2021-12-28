import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './interface/payment.interface';

@Injectable()
export class PaymentService {
    constructor(@InjectModel('Payment') private readonly paymentModel: Model<Payment>) {}

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = new this.paymentModel(createPaymentDto);
        return payment.save();
    }

    async getList(): Promise<Payment[]> {
        return this.paymentModel
              .find()
              .populate({
                path: 'order',
                select: 'total orderItem'
              })
              .populate({
                path: 'user',
                select: 'fullname roles',
              })
              .populate({
                path: 'customer',
                select: 'fullname phone',
              });
    }

    async getDetail(id: string): Promise<Payment> {
        return this.paymentModel.findById(id);
    }
}
