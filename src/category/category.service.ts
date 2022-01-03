import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Request } from 'express';
import { Error, Model } from 'mongoose';
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
    constructor(@InjectModel('Category') private readonly catModel: Model<Category>) {}

    async create(createCatDto: CreateCategoryDto): Promise<Category> {
        const existingCat = await this.catModel.findOne({ name: createCatDto.name });
        if(existingCat) {
            throw new BadRequestException(`Category name: ${createCatDto.name} is an existing`);
        }

        let cat: Category;
        try{
            cat = new this.catModel(createCatDto);
        } catch (err) {
            if(err instanceof Error.ValidationError) {
                throw new BadRequestException();
            }
        }
        return cat.save();
    }

    async getList(param: Request): Promise<any> {
        return AdvancedFilter.filter(param, this.catModel);
    }

    async getDetail(id: string): Promise<Category> {
        return this.findById(id);
    }

    async update(id: string, createCatDto: CreateCategoryDto): Promise<Category> {
        const cat = this.findById(id);
        return (await cat).updateOne(createCatDto).setOptions({ runValidators: true, new: true });
    }

    async remove(id: string): Promise<Category> {
        const cat = this.findById(id);
        return (await cat).remove();
    }

    async findById(id: string): Promise<Category> {
        let cat: Category;

        try {
            cat = await this.catModel.findOne({ _id: id });
        } catch (err) {
            if(err instanceof Error.CastError) {
                throw new BadRequestException('Invalid Object Id');
            }
        }

        if(!cat) {
            throw new NotFoundException('Category not found');
        }

        return cat;
    }
}
