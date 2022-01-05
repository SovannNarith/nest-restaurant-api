import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/user/user.service";
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && (authHeader as string).split(" ")[1]) {
      const token = (authHeader as string).split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await this.userService.findByEmail(
        JSON.parse(JSON.stringify(decoded)).email
      );
      if (!user) {
        throw new HttpException("User Not Found", HttpStatus.UNAUTHORIZED);
      }

      req.user = {
        email: user.email,
        fullname: user.fullName,
      };

      next();
    } else {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }
}
