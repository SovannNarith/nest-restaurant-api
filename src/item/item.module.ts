import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { CategorySchema } from 'src/category/schemas/category.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemSchema } from './schema/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }])
  ],
  controllers: [ItemController],
  providers: [ItemService, CategoryService, UserService],
  exports: [ItemModule]
})
export class ItemModule {}
