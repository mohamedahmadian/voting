import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp, getEnv } from './config/configApp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configApp(app);
  const PORT = getEnv('SERVER_PORT', '7000');
  await app.listen(PORT, async () => {
    const url = await app.getUrl();
    console.log('');
    console.log('--------------------');
    console.log(`${url} is running `);
    console.log('--------------------');
    console.log('');
  });
}
bootstrap();
