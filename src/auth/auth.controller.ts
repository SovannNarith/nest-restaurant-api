import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/resgister.dto';

@Controller('auth')
@UseInterceptors(FileInterceptor('file'))
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
  async getMe(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authService.getMe(req, res);
  }
}
