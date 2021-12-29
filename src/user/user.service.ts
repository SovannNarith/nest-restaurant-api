import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';
import { Request } from 'express';
import { Model } from "mongoose";
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModel(createUserDto);
        
        await this.isEmailUnique(user.email);
        await user.save();
        return this.sanitizeUser(user);
    }

    async getList(@Req() param: Request): Promise<any> {
        return AdvancedFilter.filter(param, this.userModel);
    }

    async getDetail(id: string): Promise<User> {
        return this.userModel.findById(id);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email: email }).select('+password');
    }

    async findById(id: string): Promise<User> {
        return this.userModel.findOne({ _id: id });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        let user = await this.userModel.findById(id).setOptions({ runValidators: true, new: true });
        await this.isEmailUnique(updateUserDto.email);
        
        user.fullName = updateUserDto.fullname;
        user.email = updateUserDto.email;

        return user.updateOne(user).exec();
    }


    async remove(id: string): Promise<User> {
        return this.userModel.findByIdAndRemove(id);
    }

    //Private Method
    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({email});
        if (user) {
            throw new BadRequestException('Email must be unique.');
        }
    }

    private sanitizeUser(user: User): any {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
    }

}
