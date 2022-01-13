import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { extname } from 'path';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './interface/item.interface';
import { ItemService } from './item.service';

@Controller('items')
@UseGuards(RolesGuard, AuthGuard('jwt'))
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @Roles('admin', 'manager')
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
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiOkResponse({})
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemService.update(id, updateItemDto);
  }

  @Patch(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiOkResponse({})
  upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Item> {
    return this.itemService.uploadImage(id, file);
  }

  @Get(':id/image')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiOkResponse({})
  async getImage(@Param('id') id: string, @Res() res: Response): Promise<any> {
    const file = await this.itemService.getImage(id);
    file.stream.pipe(res);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  remove(@Param('id') id: string): Promise<Item> {
    return this.itemService.remove(id);
  }
}
