import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemModule } from 'src/item/item.module';
import { ItemSchema } from 'src/item/schema/item.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    ItemModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
