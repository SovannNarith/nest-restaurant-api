import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { Response, Request } from 'express';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { Roles } from './decorator/roles.decorator';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/resgister.dto';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Post('/signin')
  async signin(
    @Req() authorization: Request,
    @Res() res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    return this.authService.login(loginDto, authorization, res);
  }

  @Get()
  @UseGuards(RolesGuard, AuthGuard('jwt'))
  @Roles('user', 'admin', 'manager')
  async getMe(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authService.getMe(req, res);
  }

  @Patch()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, cb) => {
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
  @UseGuards(RolesGuard, AuthGuard('jwt'))
  @Roles('user', 'admin', 'manager')
  async uploadProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.authService.uploadProfileImage(req, file);
  }
}
