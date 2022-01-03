import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Request } from 'express';
import { Error, Model } from "mongoose";
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        let user: User;
        try {
            user = new this.userModel(createUserDto);
        } catch (err) {
            if(err) {
                throw new BadRequestException(err);
            }
        }  

        await this.isEmailUnique(user.email);
        await user.save();
        return this.sanitizeUser(user);
    }

    async getList(@Req() param: Request): Promise<any> {
        return AdvancedFilter.filter(param, this.userModel);
    }

    async getDetail(id: string): Promise<User> {
        return this.findById(id);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email: email }).select('+password');

        if(!user) {
            throw new NotFoundException('User not Found');
        }
        return user;
    }

    async findById(id: string): Promise<User> {
        let user: User;
        try {
            user = await this.userModel.findOne({ _id: id });
        } catch (err) {
            if(err instanceof Error.CastError) {
                throw new BadRequestException('Invalid Object id');
            }
        }

        if (!user) {
            throw new NotFoundException(`User Not Found with id ${id}`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        let user = await this.findById(id);
        await this.isEmailUnique(updateUserDto.email);

        user.email = updateUserDto.email;

        return user.updateOne(user);
    }


    async remove(id: string): Promise<User> {
        const user = this.findById(id);
        
        if((await user).remove()) {
            return user;
        }
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
