import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Error, Model } from 'mongoose';
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { Customer } from 'src/customer/interface/customer.interface';
import { Item } from 'src/item/interface/item.interface';
import { User } from 'src/user/interfaces/user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './interface/order.interface';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<Order>,
        @InjectModel('Item') private readonly itemModel: Model<Item>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Customer') private readonly cusModel: Model<Customer>   
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        await this.findById(createOrderDto.user, this.userModel);
        await this.findById(createOrderDto.customer, this.cusModel);

        let i = 0;
        let pro = [];
        for (const item of createOrderDto.orderItem) {
            const product = await this.findById(item.item, this.itemModel);
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
            throw new BadRequestException();
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
        return this.findById(id, this.orderModel);
    }

    //Private Method
    private async findById(itemId: string, model: Model<any>): Promise<any> {
        let item: Model<any>;

        try {
            item = await model.findOne({ _id: itemId });
        } catch (err) {
            if(err instanceof Error.CastError) {
                throw new BadRequestException(`Invalid Object id in resource ${model.modelName}`);
            }
        }

        if(!item) {
            throw new NotFoundException(`Resource of ${model.modelName} not found`);
        }

        return item;
    }
}
