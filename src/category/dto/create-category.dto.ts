import { isNotEmpty, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(30)
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly createdBy: string;
}