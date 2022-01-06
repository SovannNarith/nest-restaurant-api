import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemSchema } from './schema/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    CategoryModule,
    UserModule,
  ],
  controllers: [ItemController],
  providers: [ItemService, CategoryService, UserService],
  exports: [MongooseModule, ItemModule],
})
export class ItemModule {}
