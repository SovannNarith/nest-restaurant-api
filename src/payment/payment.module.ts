import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from 'src/customer/customer.module';
import { OrderModule } from 'src/order/order.module';
import { UserModule } from 'src/user/user.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentSchema } from './schema/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }]),
    UserModule,
    CustomerModule,
    OrderModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentModule, MongooseModule],
})
export class PaymentModule {}
