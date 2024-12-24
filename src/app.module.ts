import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceConfig } from './typeorm.config';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceConfig,
        autoLoadEntities: true,
      }),
    }),
    PollModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
