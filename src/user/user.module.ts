import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from 'src/file/file.module';
import { FileService } from 'src/file/file.service';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    FileModule,
  ],
  controllers: [UsersController],
  providers: [UserService, FileService],
  exports: [UserModule, MongooseModule],
})
export class UserModule {}
