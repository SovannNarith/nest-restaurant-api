import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
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
        return this.findById(id, this.paymentModel);
    }

    private async findById(id: string, model: Model<any>): Promise<any> {
      let item: any;

      try {
        item = await model.findOne({ _id: id });
      } catch (err) {
        if(err instanceof Error.CastError) {
          throw new BadRequestException(`Invalid Object id in resource ${model.modelName}`);
        }
      }

      if(!item) {
        throw new NotFoundException(`No Resource of id ${id} in model ${model.modelName}`);
      }

      return item;
    }
}
