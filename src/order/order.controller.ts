import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { Roles } from "src/auth/decorator/roles.decorator";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./interface/order.interface";
import { OrderService } from "./order.service";

@Controller("orders")
@UseGuards(RolesGuard, AuthGuard("jwt"))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles("admin", "manager")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiCreatedResponse({})
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @Roles("admin", "manager")
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({})
  getList(@Req() param: Request): Promise<Order[]> {
    return this.orderService.getList(param);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({})
  getDetail(@Param("id") id: string): Promise<Order> {
    return this.orderService.getDetail(id);
  }
}
