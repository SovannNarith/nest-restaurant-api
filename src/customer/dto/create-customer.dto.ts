import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  readonly fullname: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber("KH")
  @MaxLength(12)
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  readonly createdBy: string;
}
