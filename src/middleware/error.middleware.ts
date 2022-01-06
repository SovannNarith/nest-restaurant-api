import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

@Injectable()
export class ErrorMiddleware extends Error implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(new Error.CastError.messages());
  }
}
