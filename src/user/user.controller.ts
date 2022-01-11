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
import { Request, Response } from 'express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('users')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiCreatedResponse({})
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async getList(@Req() param: Request): Promise<User[]> {
    return this.userService.getList(param);
  }

  @Get(':id')
  @Roles('user', 'admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async getDetail(@Param('id') id: string): Promise<User> {
    return this.userService.getDetail(id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiOkResponse({})
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiOkResponse({})
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //custom multer
    return this.userService.uploadProfileImage(id, file);
  }

  @Get(':id/getavatar')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiOkResponse({})
  async getAvatar(@Param('id') id: string, @Res() res: Response): Promise<any> {
    const file = await this.userService.getProfileImage(id);
    file.stream.pipe(res);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiOkResponse({})
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
