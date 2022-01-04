import { IsNumber, Min } from "class-validator";

export class UpdateItemDto {
    name?: string;

    @IsNumber()
    @Min(0)
    stockQty: number;

    status?: string;
}