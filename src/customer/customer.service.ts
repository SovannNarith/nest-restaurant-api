import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Request } from 'express';
import { Error, Model } from 'mongoose';
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './interface/customer.interface';

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private readonly cusModel: Model<Customer>) {}

    async create(createCusomerDto: CreateCustomerDto): Promise<Customer> {
        await this.isUsedPhoneNumber(createCusomerDto.phone);

        let customer: Customer;
        try {
            customer = new this.cusModel(createCusomerDto);
        } catch (err) {
            if(err instanceof Error.ValidationError) {
                throw new BadRequestException();
            }
        }
        
        return customer.save();
    }

    async getList(@Req() req: Request): Promise<any> {
        return AdvancedFilter.filter(req, this.cusModel);
    }

    async getDetail(id: string): Promise<Customer> {
        return this.findById(id);
    }

    async remove(id: string): Promise<Customer> {
        const customer = this.findById(id);

        if((await customer).remove()) {
            return customer;
        }
    }


    //Private Method
    //IsUsed Phone Number
    private async isUsedPhoneNumber(phone: string) {
        const cusPhone = await this.cusModel.findOne({ phone });
        
        if (cusPhone) {
            throw new BadRequestException('PhoneNumber is already used!');
        }
    }

    private async findById(id: string): Promise<Customer> {
        let customer: Customer;

        try {
            customer = await  this.cusModel.findOne({ _id: id });
        } catch (err) {
            if(err instanceof Error.CastError) {
                throw new BadRequestException('Invalid Object id');
            }
        }

        if(!customer) {
            throw new NotFoundException('Customer not found');
        }

        return customer;
    }
}
