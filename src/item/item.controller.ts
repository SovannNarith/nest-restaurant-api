import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { Request } from "express";
import { Roles } from "src/auth/decorator/roles.decorator";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Item } from "./interface/item.interface";
import { ItemService } from "./item.service";

@Controller("items")
@UseGuards(RolesGuard, AuthGuard("jwt"))
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @Roles("admin", "manager")
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

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  getDetail(@Param("id") id: string): Promise<Item> {
    return this.itemService.getDetail(id);
  }

  @Patch(":id")
  @Roles("admin", "manager")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiOkResponse({})
  update(
    @Param("id") id: string,
    @Body() updateItemDto: UpdateItemDto
  ): Promise<Item> {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(":id")
  @Roles("admin", "manager")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  remove(@Param("id") id: string): Promise<Item> {
    return this.itemService.remove(id);
  }
}
