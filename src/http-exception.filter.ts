import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default to internal server error if exception is not a known one
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'An unexpected error occurred. Please try again later.';
    let validationErrors = null;

    if (exception instanceof BadRequestException) {
      // Cast exceptionResponse to the expected type to access the message field
      const exceptionResponse = exception.getResponse() as { message: any };
      if (exceptionResponse && exceptionResponse.message) {
        validationErrors = exceptionResponse.message; // This will be an array of error messages
      }
    } else if (exception instanceof HttpException) {
      // For other HTTP exceptions, extract the message
      message = exception.message;
    } else if (exception instanceof Error) {
      // Handling general JavaScript errors
      message = exception.message || message;
    }

    // Log the error for debugging
    // This could be improved with a proper logging service in production
    console.error(`Error occurred at ${request.url}`, exception);

    // Return the error response
    response.status(status).json({
      statusCode: status,
      message,
      validationErrors, // Include validation errors here if present
      path: request.url,
      // Optionally include a timestamp
      timestamp: new Date().toISOString(),
    });
  }
}
