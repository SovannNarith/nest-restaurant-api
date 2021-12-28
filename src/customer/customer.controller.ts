import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './interface/customer.interface';

@Controller('customers')
export class CustomerController {
    constructor(private readonly cusService: CustomerService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({})
    @ApiCreatedResponse({})
    create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
        return this.cusService.create(createCustomerDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    getList(): Promise<Customer[]> {
        return this.cusService.getList();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    getDetail(@Param('id') id: string): Promise<Customer> {
        return this.cusService.getDetail(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    remove(@Param('id') id: string): Promise<Customer> {
        return this.cusService.remove(id);
    }
}
