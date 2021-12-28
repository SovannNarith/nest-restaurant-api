import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if(authHeader && (authHeader as string).split(' ')[1]) {
            const token = (authHeader as string).split(' ')[1];
            const decoded = this.jwtService.verify(token, process.env.JWT_SECRET_KEY as JwtVerifyOptions);

            const user = this.userService.findByEmail(decoded.email);

            if(!user) {
                throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED);
            }

            req.user = user;
            next();
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}