import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['Visa', 'Master Card', 'Cash'])
  readonly method: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  readonly user: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  readonly customer: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  readonly order: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly amount: number;

  @IsString()
  @IsEnum(['PENDING', 'PAID'])
  @IsNotEmpty()
  readonly status: string;
}
