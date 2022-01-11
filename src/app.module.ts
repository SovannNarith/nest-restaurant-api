import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { CategoryModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { FileService } from './file/file.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    ItemModule,
    CategoryModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
