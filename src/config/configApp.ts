import 'dotenv/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from 'src/utility/interceptors/request-logger.interceptor';

export const getEnv = (name: string, def = ''): string => {
  try {
    const env = process.env[name.toUpperCase()] || def;
    if (!env) {
      throw new Error(
        `${name.toUpperCase()} not found on global environment vars`,
      );
    }
    return env;
  } catch (error) {
    console.log(error);
  }
};

export const availableEnv = {
  LOCAL: 'LOCAL',
  DEVELOPMENT: 'DEVELOPMENT',
  PRODUCTION: 'PRODUCTION',
};

export const currentEnv = () => getEnv('ENV', availableEnv.LOCAL) as any;

export const isLocal = () => currentEnv() === availableEnv.LOCAL;

export function configApp(app: any) {
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
  //==================== Interceptor ===============================
}
