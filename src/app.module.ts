import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceConfig } from './typeorm.config';
import { PollModule } from './poll/poll.module';
import { OptionsModule } from './option/option.module';
import { UserModule } from './user/user.module';
import { VoteModule } from './vote/vote.module';
import { ClientModule } from './client/client.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceConfig,
        autoLoadEntities: true,
      }),
    }),
    VoteModule,
    PollModule,
    OptionsModule,
    UserModule,
    ClientModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
