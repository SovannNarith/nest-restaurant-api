import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
    constructor(@InjectModel('Category') private readonly catModel: Model<Category>) {}

    async create(createCatDto: CreateCategoryDto): Promise<Category> {
        const cat = new this.catModel(createCatDto);

        return cat.save();
    }

    async getList(param: Request): Promise<any> {
        return AdvancedFilter.filter(param, this.catModel);
    }

    async getDetail(id: string): Promise<Category> {
        return this.catModel.findOne({ _id: id });
    }

    async update(id: string, createCatDto: CreateCategoryDto): Promise<Category> {
        return this.catModel.findByIdAndUpdate({ _id: id }, createCatDto).setOptions({ runValidators: true, new: true });
    }

    async remove(id: string): Promise<Category> {
        return this.catModel.findByIdAndRemove(id);
    }
}
