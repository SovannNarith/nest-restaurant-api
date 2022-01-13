import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { File } from './interface/file.interface';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class FileService {
  constructor(@InjectModel('File') private readonly fileModel: Model<File>) {}

  async uploadFile(
    objectId: string,
    file: Express.Multer.File,
    model?: Model<any>,
  ) {
    const s3 = new S3();
    const newLocal = {
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Body: file.buffer,
      Key: uuidv4(),
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_PUBLIC_BUCKET_NAME,
      },
    };

    const user = await model.findById(objectId);
    if (!user) throw new BadRequestException('Resource Not Found');

    const returnFile = await s3.upload(newLocal).promise();
    if (!returnFile) throw new BadRequestException('Can not upload File');

    const uploadFileDto: UploadFileDto = {
      originalName: file.originalname,
      buffer: file.buffer,
      path: returnFile.Location,
      key: returnFile.Key,
    };

    const fileInfo = new this.fileModel(uploadFileDto);
    if (!fileInfo)
      throw new BadRequestException('Can not save file information');
    const returnFileInfo = await fileInfo.save();

    await user.updateOne({ image: returnFile.Key });
    user.image = returnFile.Key;
    return {
      data: user,
      file: {
        originalName: returnFileInfo.originalName,
        path: returnFile.Location,
        key: returnFile.Key,
      },
    };
  }

  async getFile(objectId: string, model: Model<any>): Promise<any> {
    const user = await model.findOne({ _id: objectId });
    if (!user) throw new BadRequestException('Resource Not Found');

    const s3 = new S3();
    if (user) {
      const stream = s3
        .getObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: user.image,
        })
        .createReadStream();

      return {
        success: true,
        stream,
      };
    }
    throw new BadRequestException('Can not get Object');
  }
}
