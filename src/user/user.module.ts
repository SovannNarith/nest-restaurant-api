import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorMiddleware } from 'src/middleware/error.middleware';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserModule]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(ErrorMiddleware).forRoutes({
        path: 'users/:id',
        method: RequestMethod.POST
      });
  }
}
