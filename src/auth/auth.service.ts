import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "src/user/interfaces/user.interface";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login-auth.dto";
import { RegisterDto } from "./dto/resgister.dto";
import { Payload } from "./type/payload";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const user = await this.userService.create(registerDto);

    const obj = {
      user,
      token: await this.createAccessToken(user.email),
    };
    return obj;
  }

  async login(loginDto: LoginDto, req: Request, res: Response) {
    let user: any;

    const token = this.headerToken(req);
    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET_KEY,
        });
        user = await this.userService.findByEmail(
          JSON.parse(JSON.stringify(decoded)).email
        );
        if (!user) throw new UnauthorizedException("User not found.");
      } catch (error) {
        return res.status(403).send({
          success: false,
          message: error,
        });
      }
    } else {
      user = await this.validateUser({ email: loginDto.email });
      await this.checkPassword(loginDto.password, user.password);
    }

    const users = user.toObject();
    delete users["password"];
    const obj = {
      users,
      token: await this.createAccessToken(user.email),
    };
    return res.status(201).send({
      success: true,
      obj,
    });
  }

  async createAccessToken(email: string) {
    const accessToken = this.jwtService.sign(
      { email },
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    return {
      accessToken,
      expire: new Date(Date.now() + parseInt(process.env.JWT_EXPIRATION, 10)),
    };
  }

  async validateUser(payload: Payload): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException("User not found.");
    return user;
  }

  private headerToken(request: any) {
    if (request.header("Authorization")) {
      return request
        .get("Authorization")
        .replace("Bearer ", "")
        .replace(" ", "");
    } else if (request.headers.authorization) {
      return request.headers.authorization
        .replace("Bearer ", "")
        .replace(" ", "");
    } else if (request.body.token) {
      return request.body.token.replace(" ", "");
    }

    if (request.query.token) return request.body.token.replace(" ", "");
  }

  private async checkPassword(attemptPass: string, userMatch: string) {
    const match = await bcrypt.compare(attemptPass, userMatch);
    if (!match) throw new NotFoundException("Wrong email or password.");
    return match;
  }
}
