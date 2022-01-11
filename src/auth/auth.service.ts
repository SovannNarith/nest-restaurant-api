import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/resgister.dto';
import { Payload } from './type/payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const user = await this.userService.create(registerDto);

    const obj = {
      user,
      token: await this.createAccessToken(user.email),
    };
    return obj;
  }

  async login(loginDto: LoginDto, req: Request, res?: Response) {
    try {
      let user: User;
      const token = this.headerToken(req);
      if (token) {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET_KEY,
        });
        user = await this.userService.findByEmail(
          JSON.parse(JSON.stringify(decoded)).email,
        );
        console.log(decoded, user);
        if (!user) throw new UnauthorizedException('User not found.');
      } else {
        user = await this.validateUser({ email: loginDto.email });
        await this.checkPassword(loginDto.password, user.password);
      }
      
      const createdToken = await this.createAccessToken(user.email);
      const users = user.toObject();
      delete users['password'];
      return res
        .status(201)
        .json({ success: true, data: users, token: createdToken });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: err });
    }
  }

  async getMe(req: Request, res: Response): Promise<any> {
    try {
      const token = this.headerToken(req);
      if (!token)
        throw new BadRequestException('User does not have access token');

      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.userService.findByEmail(
        JSON.parse(JSON.stringify(decoded)).email,
      );
      if (!user) throw new UnauthorizedException('User not found.');
      const users = user.toObject();
      delete users.password;
      return res.status(HttpStatus.OK).json({ success: true, data: users });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: err });
    }
  }

  async createAccessToken(email: string) {
    const accessToken = this.jwtService.sign(
      { email },
      { expiresIn: process.env.JWT_EXPIRATION },
    );
    return {
      accessToken,
      expire: new Date(Date.now() + parseInt(process.env.JWT_EXPIRATION, 10)),
    };
  }

  async validateUser(payload: Payload): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException('User not found.');
    return user;
  }

  private headerToken(request: any) {
    if (request.header('Authorization')) {
      return request
        .get('Authorization')
        .replace('Bearer ', '')
        .replace(' ', '');
    } else if (request.headers.authorization) {
      return request.headers.authorization
        .replace('Bearer ', '')
        .replace(' ', '');
    } else if (request.body.token) {
      return request.body.token.replace(' ', '');
    }

    if (request.query.token) return request.body.token.replace(' ', '');
  }

  private async checkPassword(attemptPass: string, userMatch: string) {
    const match = await bcrypt.compare(attemptPass, userMatch);
    if (!match) throw new NotFoundException('Wrong email or password.');
    return match;
  }
}
