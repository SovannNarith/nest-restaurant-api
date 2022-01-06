import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  //fullname
  @ApiProperty({
    example: 'Sovann Narith',
    description: 'add name of user',
    format: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  //password
  @ApiProperty({
    example: '12345',
    description: 'password should be strong',
    format: 'string',
    minLength: 5,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly password: string;
}
