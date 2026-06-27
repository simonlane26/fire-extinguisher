import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const is5xx = status >= 500;

    // Always log full details server-side, including stack traces
    this.logger.error(
      `${request.method} ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    // For 5xx errors, always return a generic message — never leak internals
    // For 4xx HttpExceptions, the message is developer-set and intentional
    let clientMessage: string;
    if (is5xx) {
      clientMessage = 'An unexpected error occurred. Please try again later.';
    } else if (isHttpException) {
      const body = exception.getResponse();
      clientMessage = typeof body === 'string'
        ? body
        : (body as any).message ?? 'An error occurred';
      // Normalise arrays from class-validator into a single string
      if (Array.isArray(clientMessage)) {
        clientMessage = (clientMessage as string[]).join('; ');
      }
    } else {
      clientMessage = 'An unexpected error occurred. Please try again later.';
    }

    response.status(status).json({
      statusCode: status,
      message: clientMessage,
    });
  }
}
