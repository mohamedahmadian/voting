import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm'; // For handling TypeORM errors (optional)
import { QueryFailedError } from 'typeorm'; // For handling database errors (optional)

@Catch() // This will catch all errors, not just HTTP exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // If the error is a known TypeORM error
    if (exception instanceof EntityNotFoundError) {
      this.logger.error('Entity not found', exception.stack);
    } else if (exception instanceof QueryFailedError) {
      this.logger.error('Database query failed', exception.stack);
    } else {
      this.logger.error('Unhandled error', exception.stack);
    }

    // Log the error for debugging purposes
    this.logger.error('Error Message: ', exception.message);

    // Return a response with error details
    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
