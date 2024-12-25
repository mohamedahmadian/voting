import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientGateway } from './client.gateway';
import { ClientController } from './client.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [ClientService, ClientGateway],
})
export class ClientModule {}
