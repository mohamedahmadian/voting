import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ClientService } from './client.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ClientGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ClientGateway.name);

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
  }

  logActiveConnection() {
    this.logger.log(
      `Active clients:${this.clientService.getAllClientsCount()}`,
    );
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    this.logger.log(`Message received: ${payload} from client: ${client.id}`);
    return 'Message received!';
  }

  @SubscribeMessage('broadcast')
  handleBroadcastMessage(client: Socket, payload: { message: string }): void {
    this.logger.log(`Broadcasting message: ${payload.message}`);
    this.clientService.getAllClients().forEach((socket) => {
      socket.emit('broadcast', {
        message: payload.message,
        from: client.id,
      });
    });
  }
}
