import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ClientService } from './client.service';
import { Socket, Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: { origin: '*' } })
export class ClientGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ClientGateway.name);
  private server = new Server();

  constructor(private readonly clientService: ClientService) {}

  handleConnection(client: Socket) {
    this.clientService.addClient(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.clientService.removeClient(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('Client Gateway Initialized');
    this.server = server;
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    this.logger.log(`Message received: ${payload} from client: ${client.id}`);
    return 'Message received!';
  }

  // this event will be fired from the controller to broadcast message via the http endpoint
  @OnEvent('broadcastMessage')
  handleBroadcastMessage(message: string): void {
    this.server.emit('broadcast', {
      from: `boradcasting system`,
      message: message,
    });
  }
}
