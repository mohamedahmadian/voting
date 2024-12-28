import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceConfig } from '../typeorm.config';
import { PollModule } from '../poll/poll.module';
import { OptionsModule } from '../option/option.module';
import { UserModule } from '../user/user.module';
import { VoteModule } from '../vote/vote.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceConfig,
        autoLoadEntities: true,
      }),
    }),
    VoteModule,
    ClientModule,
    PollModule,
    OptionsModule,
    UserModule,
  ],
})
export class AppModule {}
