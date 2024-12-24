import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isLocal } from 'src/config/configApp';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const total = Date.now() - now;
        if (!isLocal()) {
          console.log();
          console.log(
            '--------------------------------------------------------',
          );
          console.log(`Start: ${new Date(now).toLocaleTimeString()} `);
          console.log(`Total: ${total}ms `);
          console.log('Method: ====>', req.method);
          console.log('URL:    ====>', req.originalUrl);
          if (Object.keys(req.query).length > 0) {
            console.log('Query: ====>', req.query);
          }
          if (req.method !== 'GET' && req.body) {
            console.log('Body:  ====>', req.body);
          }

          console.log(
            '--------------------------------------------------------',
          );
        } else {
          const logObject: any = {
            Method: req.method,
            URL: req.originalUrl,
            total: total + ' ms',
          };
          if (req.method !== 'GET' && req.body) logObject.body = req.body;
          if (Object.keys(req.query).length > 0) logObject.query = req.query;
          console.log(JSON.stringify(logObject));
        }
      }),
    );
  }
}
