import {HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/resgister.dto';
import { Payload } from './type/payload';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async register(registerDto: RegisterDto) {
        return this.userService.create(registerDto);
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findByEmail(loginDto.email);

        if(!user) {
            throw new NotFoundException(`User not found with Email: ${loginDto.email}`);
        }

        const isPasswordMatching = await bcrypt.compare(user.password, loginDto.password);
        if (isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    async getCookieWithJwtToken(payload: Payload) {
        const token = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRATION'),
            algorithm: 'HS256'
        });

        const obj = {
            Authentication: `${token}`,
            HttpOnly: true,
            Path: '/',
            Max_Age: this.configService.get('JWT_EXPIRATION')
        };
        return obj;
    }
}
