import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { Item } from 'src/item/interface/item.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './interface/order.interface';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<Order>,
        @InjectModel('Item') private readonly itemModel: Model<Item>    
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        let i = 0;
        let pro = [];
        for (const item of createOrderDto.orderItem) {
            const product = await this.getProduct(item.item);
            createOrderDto.orderItem[i].price = product.price;

            pro.push(product.updateOne({ stockQty: product.stockQty - item.quantity }));
            i++;
        }

        let total = 0;
        createOrderDto.orderItem.forEach(item => {
            total = total + item.quantity * item.price;
            createOrderDto.total = total;
        });

        const order = new this.orderModel(createOrderDto);
        if (!order && !order.orderItem) {
            throw new BadRequestException('Add Item to make order');
        }

        if (order.total <= 0 ) {
            throw new BadRequestException('Total must be > 1');
        }
        
        let orders: any;
        if((orders = order.save())) {
            pro.forEach(async item => await item)
        } 
        return orders;
    }

    async getList(param: Request): Promise<any> {
        return AdvancedFilter.filter(param, this.orderModel, 
            [
                {
                    path: 'user',
                    select: 'fullname' 
                }, {
                    path: 'customer',
                    select: 'fullname'
                }, { 
                    path: 'orderItem',
                    select: 'items'
                }
            ], [
                {
                    path: 'orderItem.items',
                    select: 'name'
                }
            ]
        );
    }

    async getDetail(id: string): Promise<Order> {
        return this.orderModel.findOne({ _id: id });
    }

    //Private Method
    private async getProduct(itemId: string): Promise<Item> {
        const item = await this.itemModel.findById(itemId);
        return item;
    }
}
