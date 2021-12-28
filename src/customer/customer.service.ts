import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './interface/customer.interface';

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private readonly cusModel: Model<Customer>) {}

    async create(createCusomerDto: CreateCustomerDto): Promise<Customer> {
        const customer = new this.cusModel(createCusomerDto);
        await this.isUsedPhoneNumber(customer.phone);

        return customer.save();
    }

    async getList(): Promise<Customer[]> {
        return this.cusModel.find().exec();
    }

    async getDetail(id: string): Promise<Customer> {
        return this.cusModel.findById(id);
    }

    async remove(id: string): Promise<Customer> {
        return this.cusModel.findByIdAndRemove(id);
    }


    //Private Method
    //IsUsed Phone Number
    private async isUsedPhoneNumber(phone: string) {
        const cusPhone = await this.cusModel.findOne({ phone });
        
        if (cusPhone) {
            throw new BadRequestException('PhoneNumber is already used!');
        }
    }
}
