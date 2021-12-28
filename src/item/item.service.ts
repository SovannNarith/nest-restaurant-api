import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './interface/item.interface';

@Injectable()
export class ItemService {
    constructor(@InjectModel('Item') private readonly itemModel: Model<Item>) {}

    async create(createItemDto: CreateItemDto): Promise<Item> {
        const item = new this.itemModel(createItemDto);

        return item.save();
    }

    async getList(param: Request): Promise<any> {
        return AdvancedFilter.filter(param, this.itemModel);
    }

    async getDetail(id: string): Promise<Item> {
        return this.itemModel.findOne({ _id: id });
    }

    async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
        let item = await this.itemModel.findById(id).setOptions({ runValidators: true, new: true });
        
        item.stockQty = item.stockQty + updateItemDto.stockQty;
        item.status = item.stockQty === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE';
        item.name? item.name : updateItemDto.name;
        
        return item.save();
    }

    async remove(id: string): Promise<Item> {
        return this.itemModel.findByIdAndRemove(id);
    }
}
