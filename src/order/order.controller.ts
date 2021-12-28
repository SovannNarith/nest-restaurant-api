import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './interface/order.interface';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({})
    @ApiCreatedResponse({})
    create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.orderService.create(createOrderDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({})
    getList(@Req() param: Request): Promise<Order[]> {
        return this.orderService.getList(param);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({})
    getDetail(@Param('id') id: string): Promise<Order> {
        return this.orderService.getDetail(id);
    }
}
