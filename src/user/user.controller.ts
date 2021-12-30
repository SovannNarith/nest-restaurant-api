import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({})
    @ApiCreatedResponse({})
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }


    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Roles('user', 'admin', 'manager')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getList(@Req() param: Request): Promise<User[]> {
        return this.userService.getList(param);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getDetail(@Param('id') id: string): Promise<User> {
        return this.userService.getDetail(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({})
    @ApiOkResponse({})
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({})
    @ApiOkResponse({})
    async remove(@Param('id') id: string): Promise<User> {
        return this.userService.remove(id);
    }
}
