import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { FileSchema } from './schema/file.schema';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FileSchema }])],
  providers: [FileService],
  exports: [MongooseModule, FileModule],
})
export class FileModule {}
