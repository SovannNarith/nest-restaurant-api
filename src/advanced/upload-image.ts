/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';

export class UploadImage {
  static async upload(id: string, buffer: Buffer, __filename: string): Promise<any> {
    const s3 = new S3();
    const newLocal = {
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Body: buffer,
      Key: `${id}-${__filename}`,
      ContentType: 'mimetype',
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_PUBLIC_BUCKET_NAME
      }
    };
    return await s3.upload(newLocal).promise();
  }

  static async getFile(object: any): Promise<any> {
      const fileKey = object.image;
      const s3 = new S3();
      if(object) {
          const stream = s3.getObject({
              Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
              Key: fileKey
          })
          .createReadStream();

          return {
              success: true,
              stream
          }
      }
      throw new BadRequestException('Can not get Object');
  }
}
