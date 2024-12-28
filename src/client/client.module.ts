import { forwardRef, Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientGateway } from './client.gateway';
import { ClientController } from './client.controller';
import { VoteModule } from '../vote/vote.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService, ClientGateway],
  exports: [ClientService],
  imports: [forwardRef(() => VoteModule)],
})
export class ClientModule {}
