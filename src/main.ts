import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { configApp } from './app/configApp';
import Datasource from './typeorm.config';
import { getEnv } from './utility/utility';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await Datasource.initialize();

  configApp(app);
  const PORT = getEnv('SERVER_PORT', '7000');

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req, res) => {
    res.redirect('/swagger');
  });

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
