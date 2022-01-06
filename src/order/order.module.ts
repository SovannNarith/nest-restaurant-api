import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from 'src/customer/customer.module';
import { ItemModule } from 'src/item/item.module';
import { UserModule } from 'src/user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    UserModule,
    CustomerModule,
    ItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderModule, MongooseModule],
})
export class OrderModule {}
