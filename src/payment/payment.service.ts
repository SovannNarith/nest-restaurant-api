import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Customer } from 'src/customer/interface/customer.interface';
import { Order } from 'src/order/interface/order.interface';
import { User } from 'src/user/interfaces/user.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './interface/payment.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Customer') private readonly cusModel: Model<Customer>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    await this.findById(createPaymentDto.user, this.userModel);
    await this.findById(createPaymentDto.customer, this.cusModel);
    await this.findById(createPaymentDto.order, this.orderModel);
    // if(order.status !== 'PENDING') {
    //   throw new BadRequestException('This Order has been cancel or paid success by s1');
    // }
    const payment = new this.paymentModel(createPaymentDto);
    if (!payment) throw new BadRequestException();
    return payment.save();
  }

  async getList(): Promise<Payment[]> {
    return this.paymentModel
      .find()
      .populate({
        path: 'order',
        select: 'total orderItem',
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
    try {
      const item = await model.findOne({ _id: id });
      if (!item)
        throw new NotFoundException(
          `No Resource of id ${id} in model ${model.modelName}`,
        );
      return item;
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException(
          `Invalid Object id in resource ${model.modelName}`,
        );
    }
  }
}
