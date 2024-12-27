import 'dotenv/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from 'src/utility/interceptors/request-logger.interceptor';
import { AllExceptionsFilter } from 'src/utility/exceptionFilter/AllExceptionFilter';
import { TransformInterceptor } from 'src/utility/interceptors/transform.interceptor';
import { getEnv } from 'src/utility/utility';

export function configApp(app: INestApplication<any>) {
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = new DocumentBuilder()
    .setTitle(getEnv('SERVICE_NAME'))
    .setDescription(getEnv('SERVICE_DESC'))
    .setVersion(getEnv('SERVICE_VER'))
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  //==================== swagger ==================

  // =================== additional plugins ==========================
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // =================== additional plugins ==========================

  //==================== Interceptor ===============================
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  //==================== Interceptor ===============================
}
