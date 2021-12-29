import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
    
    }
}