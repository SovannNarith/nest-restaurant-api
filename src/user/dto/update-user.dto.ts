import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  //fullname
  @ApiProperty({
    example: 'Sovann Narith',
    description: 'add name of user',
    format: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  readonly fullname: string;

  //email
  @ApiProperty({
    example: 'rails@gmail.com',
    description: 'email of user',
    format: 'email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  readonly email: string;
}
