import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger = new Logger('Voting System');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const total = Date.now() - now;
        const logObject: any = {
          Method: req.method,
          URL: req.originalUrl,
          total: total + ' ms',
        };
        if (req.method !== 'GET' && req.body) logObject.body = req.body;
        if (Object.keys(req.query).length > 0) logObject.query = req.query;
        this.logger.log(JSON.stringify(logObject));
      }),
      catchError((error) => {
        const total = Date.now() - now;
        const logObject: any = {
          Method: req.method,
          URL: req.originalUrl,
          total: total + ' ms',
          error: error.message || 'Unknown error',
        };
        if (req.method !== 'GET' && req.body) logObject.body = req.body;
        if (Object.keys(req.query).length > 0) logObject.query = req.query;
        this.logger.error(JSON.stringify(logObject));
        return throwError(() => error);
      }),
    );
  }
}
