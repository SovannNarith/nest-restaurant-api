import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from 'src/customer/schema/customer.schema';
import { ItemModule } from 'src/item/item.module';
import { ItemSchema } from 'src/item/schema/item.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    ItemModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
