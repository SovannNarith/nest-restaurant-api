import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './interface/customer.interface';

@Controller('customers')
@UseGuards(RolesGuard, AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly cusService: CustomerService) {}

  @Post()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiCreatedResponse({})
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.cusService.create(createCustomerDto);
  }

  @Get()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  getList(@Req() req: Request): Promise<any> {
    return this.cusService.getList(req);
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  getDetail(@Param('id') id: string): Promise<Customer> {
    return this.cusService.getDetail(id);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  remove(@Param('id') id: string): Promise<Customer> {
    return this.cusService.remove(id);
  }
}
