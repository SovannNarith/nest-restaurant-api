import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from 'mongoose';

@Catch(NotFoundException)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception);
    if (exception) {
      response.status(HttpStatus.BAD_REQUEST).json({ success: false });
    }
    // if (exception.name === 'CastError') {
    //   response.status(HttpStatus.BAD_REQUEST).json({ success: false });
    // }
    // response.status(404).json({ success: false });
  }
}
