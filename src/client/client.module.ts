import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientGateway } from './client.gateway';
import { ClientController } from './client.controller';
import { VoteModule } from 'src/vote/vote.module';

@Module({
  imports: [VoteModule],
  controllers: [ClientController],
  providers: [ClientService, ClientGateway],
})
export class ClientModule {}
