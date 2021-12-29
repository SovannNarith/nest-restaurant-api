import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemSchema } from './schema/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }])
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemModule]
})
export class ItemModule {}
