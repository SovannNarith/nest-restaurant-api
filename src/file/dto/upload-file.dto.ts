import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  readonly originalName: string;

  @IsNotEmpty()
  @IsNumber()
  readonly buffer: Buffer;

  @IsString()
  @IsNotEmpty()
  readonly path: string;

  @IsUUID()
  @IsNotEmpty()
  readonly key: string;
}
