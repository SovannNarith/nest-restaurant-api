import { Body, Controller, Post, Req, Res} from '@nestjs/common';
import { Response, Request } from 'express';
import { User } from 'src/user/interfaces/user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/resgister.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    register(@Body() registerDto: RegisterDto): Promise<User> {
        return this.authService.register(registerDto);
    }

    @Post('/signin')
    async signin(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response): Promise<any> {
        const cookieToken = await this.authService.getCookieWithJwtToken({ 'email': loginDto.email });
        return res
                .status(201)
                .cookie(
                    'Authentication', 
                    cookieToken.Authentication, 
                    {
                        httpOnly: cookieToken.HttpOnly,
                        maxAge: cookieToken.Max_Age * 60 * 60 * 60
                    }
                )
                .send({ success: true });
    }
}
