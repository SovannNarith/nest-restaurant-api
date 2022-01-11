import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (Error.DocumentNotFoundError) {
      console.log(2);
    }

    if (Error.CastError) {
      console.log(1);
    }

    next();
  }
}
