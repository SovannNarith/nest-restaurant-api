import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './interface/payment.interface';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({})
    @ApiCreatedResponse({})
    create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
        return this.paymentService.create(createPaymentDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    getList(): Promise<Payment[]> {
        return this.paymentService.getList();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    getDetail(@Param('id') id: string): Promise<Payment> {
        return this.paymentService.getDetail(id);
    }
}
