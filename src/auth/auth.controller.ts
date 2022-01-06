import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/resgister.dto';

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
}
