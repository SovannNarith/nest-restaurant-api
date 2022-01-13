/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class ItemImageDto {
  @IsNotEmpty()
  @IsString()
  readonly image: string;
}
