import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientGateway } from './client.gateway';

@Module({
  providers: [ClientService, ClientGateway],
})
export class ClientModule {}
