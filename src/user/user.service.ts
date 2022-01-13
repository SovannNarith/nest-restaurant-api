import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Error, Model } from 'mongoose';
import { AdvancedFilter } from 'src/advanced/advanced-filter';
import { FileService } from 'src/file/file.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly fileService: FileService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);
      await this.isEmailUnique(user.email);
      await user.save();
      return this.sanitizeUser(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getList(@Req() param: Request): Promise<any> {
    return AdvancedFilter.filter(param, this.userModel);
  }

  async getDetail(id: string): Promise<User> {
    return this.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email: email })
      .select('+password');
    if (!user) throw new NotFoundException('User not Found');
    return user;
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (!user) throw new NotFoundException(`User Not Found with id ${id}`);
      return user;
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException('Invalid Object id');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    await this.isEmailUnique(updateUserDto.email);
    user.email = updateUserDto.email;
    return user.updateOne(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findById(id);
    if (user) return user.remove();
  }

  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<any> {
    return this.fileService.uploadFile(userId, file, this.userModel);
  }

  async getProfileImage(userId: string): Promise<any> {
    return this.fileService.getFile(userId, this.userModel);
  }

  //Private Method
  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) throw new BadRequestException('Email must be unique.');
  }

  private sanitizeUser(user: User): any {
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }
}
