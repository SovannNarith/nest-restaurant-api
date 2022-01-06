import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './interface/payment.interface';
import { PaymentService } from './payment.service';

@Controller('payments')
@UseGuards(RolesGuard, AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiCreatedResponse({})
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @Roles('admin', 'manager')
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
