import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception.name === "11000") {
      response.status(HttpStatus.BAD_REQUEST).json({ success: false });
    }
    if (exception.name === "CastError") {
      response.status(HttpStatus.BAD_REQUEST).json({ success: false });
    }
  }
}