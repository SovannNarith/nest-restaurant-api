import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";


export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(20)
    @MaxLength(150)
    readonly description: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly stockQty: number;

    readonly categories: [string];

    readonly createdBy: string; 

    @IsEnum(['OUT_OF_STOCK', 'AVAILABLE'])
    readonly status: string; 
}