import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from "express";
import { User } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/resgister.dto';
import { Payload } from './type/payload';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto): Promise<any> {
        const user = await this.userService.create(registerDto);
        
        const obj = {
            token: await this.createAccessToken(user.email)
        }
        return obj;
    }

    async login(loginDto: LoginDto, req: Request) {
        const token = this.headerToken(req);
        if (token) {
            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
            const user = await this.userService.findByEmail(JSON.parse(JSON.stringify(decoded)).email);
    
            if(!user) {
                throw new UnauthorizedException('User not found.');
            }
    
            return user;
        } else {
            const user = await this.validateUser({ email: loginDto.email });
            await this.checkPassword(loginDto.password, user.password);

            let users = user.toObject();
            delete users['password'];
            const obj = {
                users,
                token: await this.createAccessToken(user.email)
            }
            return obj;
        }
    }

    async createAccessToken(email: string) {
        const accessToken = this.jwtService.sign({email}, { expiresIn: process.env.JWT_EXPIRATION});
        return accessToken;
    }

    async validateUser(payload: Payload): Promise<User> {
        const user = await this.userService.findByEmail(payload.email);
        if (!user) {
          throw new UnauthorizedException('User not found.');
        }
        return user;
    }

    returnJwtExtractor() {
        return this.jwtExtractor;
    }

    private jwtExtractor(request: Request) {
        const token = this.getHeaderToken(request);
        if (!token) {
            throw  new BadRequestException('Bad request.');
        }
        return token;
    }

    private getHeaderToken = (request: Request) => {
        let token = null

        if (request.header('Authorization')) {
            token = request.get('Authorization').replace('Bearer ', '').replace(' ', '');
        } else if (request.headers.authorization) {
            token = request.headers.authorization.replace('Bearer ', '').replace(' ', '');
        } else if (request.body.token) {
            token = request.body.token.replace(' ', '');
        }

        if (request.query.token) {
            token = request.body.token.replace(' ', '');
        }

        return token;
    }

    private headerToken(request: any) {
        if (request.header('Authorization')) {
            return request.get('Authorization').replace('Bearer ', '').replace(' ', '');
        } else if (request.headers.authorization) {
            return request.headers.authorization.replace('Bearer ', '').replace(' ', '');
        } else if (request.body.token) {
            return request.body.token.replace(' ', '');
        }

        if (request.query.token) {
            return request.body.token.replace(' ', '');
        }
    }

    private async checkPassword(attemptPass: string, userMatch: string) {
        const match = await bcrypt.compare(attemptPass, userMatch);
        if (!match) {
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
    }
}
