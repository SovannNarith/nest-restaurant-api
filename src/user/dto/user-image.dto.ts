import { IsNotEmpty, IsString } from 'class-validator';

export class UserImageDto {
  @IsNotEmpty()
  @IsString()
  readonly image: string;
}
