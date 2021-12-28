import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './interface/item.interface';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post()
    @Roles('Admin')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({})
    @ApiCreatedResponse({})
    create(@Body() createItemDto: CreateItemDto): Promise<Item> {
        return this.itemService.create(createItemDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    getList(@Req() param: Request): Promise<any> {
        return this.itemService.getList(param);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    getDetail(@Param('id') id: string): Promise<Item> {
        return this.itemService.getDetail(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({})
    @ApiOkResponse({})
    update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): Promise<Item> {
        return this.itemService.update(id, updateItemDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    remove(@Param('id') id: string): Promise<Item> {
        return this.itemService.remove(id);
    }
}
