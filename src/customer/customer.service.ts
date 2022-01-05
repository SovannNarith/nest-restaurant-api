import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Error, Model } from "mongoose";
import { AdvancedFilter } from "src/advanced/advanced-filter";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { Customer } from "./interface/customer.interface";

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel("Customer") private readonly cusModel: Model<Customer>
  ) {}

  async create(createCusomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      await this.isUsedPhoneNumber(createCusomerDto.phone);
      const customer = new this.cusModel(createCusomerDto);
      return customer.save();
    } catch (err) {
      if (err instanceof Error.ValidationError) throw new BadRequestException();
    }
  }

  async getList(@Req() req: Request): Promise<any> {
    return AdvancedFilter.filter(req, this.cusModel);
  }

  async getDetail(id: string): Promise<Customer> {
    return this.findById(id);
  }

  async remove(id: string): Promise<Customer> {
    const customer = this.findById(id);
    const result = (await customer).remove();
    return result;
  }

  //Private Method
  //IsUsed Phone Number
  private async isUsedPhoneNumber(phone: string) {
    const cusPhone = await this.cusModel.findOne({ phone });
    if (cusPhone) throw new BadRequestException("PhoneNumber is already used!");
  }

  private async findById(id: string): Promise<Customer> {
    try {
      const customer = await this.cusModel.findOne({ _id: id });
      if (!customer) throw new NotFoundException("Customer not found");
      return customer;
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException("Invalid Object id");
    }
  }
}
