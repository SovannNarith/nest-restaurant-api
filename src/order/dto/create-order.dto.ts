import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    readonly user: string;

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    readonly customer: string;

    @IsArray()
    @IsNotEmpty()
    readonly orderItem: [
        items: {
            readonly item: string,
            price: number,
            readonly quantity: number
        }  
    ];

    total: number;
}