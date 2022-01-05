import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Error, Model } from "mongoose";
import { AdvancedFilter } from "src/advanced/advanced-filter";
import { CategoryService } from "src/category/category.service";
import { UserService } from "src/user/user.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Item } from "./interface/item.interface";

@Injectable()
export class ItemService {
  constructor(
    @InjectModel("Item") private readonly itemModel: Model<Item>,
    private readonly catService: CategoryService,
    private readonly userService: UserService
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    try {
      const existingItem = await this.itemModel.findOne({
        name: createItemDto.name,
      });
      if (existingItem) throw new BadRequestException("Item already exist");
      for (const catItem of createItemDto.categories)
        await this.catService.findById(catItem);
      await this.userService.findById(createItemDto.createdBy);

      const item = new this.itemModel(createItemDto);
      return item.save();
    } catch (err) {
      if (err instanceof Error.ValidationError) throw new BadRequestException();
    }
  }

  async getList(param: Request): Promise<any> {
    return AdvancedFilter.filter(param, this.itemModel);
  }

  async getDetail(id: string): Promise<Item> {
    return this.findById(id);
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findById(id);
    item.stockQty = item.stockQty + updateItemDto.stockQty;
    item.status = item.stockQty === 0 ? "OUT_OF_STOCK" : "AVAILABLE";
    item.name = item?.name || updateItemDto?.name;

    return item.updateOne(item).setOptions({ runValidators: true, new: true });
  }

  async remove(id: string): Promise<Item> {
    const item = this.findById(id);
    const result = (await item).remove();
    return result;
  }

  private async findById(id: string): Promise<Item> {
    try {
      const item = await this.itemModel.findOne({ _id: id });
      if (!item) throw new NotFoundException("Item not found");
      return item;
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException("Invalid Object Id");
    }
  }
}
