import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('category')
@UseGuards(RolesGuard, AuthGuard('jwt'))
export class CategoryController {
    constructor(private readonly catService: CategoryService) {}

    @Post()
    @Roles('admin', 'manager')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({})
    @ApiCreatedResponse({})
    async create(@Body() createCatDto: CreateCategoryDto): Promise<Category> {
        return this.catService.create(createCatDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getList(@Req() param: Request): Promise<any> {
        return this.catService.getList(param);
    }

    @Get(':id')
    @Roles('admin', 'manager')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    async getDetail(@Param('id') id: string): Promise<Category> {
        return this.catService.getDetail(id);
    }

    @Patch(':id')
    @Roles('admin', 'manager')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({})
    @ApiOkResponse({})
    async update(@Param('id') id: string, @Body() createCatDto: CreateCategoryDto): Promise<Category> {
        return this.catService.update(id, createCatDto);
    }

    @Delete(':id')
    @Roles('admin', 'manager')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({})
    @ApiOkResponse({})
    async remove(@Param('id') id: string): Promise<Category> {
        return this.catService.remove(id);
    }
}
