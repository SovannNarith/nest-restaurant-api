import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from 'src/customer/schema/customer.schema';
import { OrderSchema } from 'src/order/schema/order.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentSchema } from './schema/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
