import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ClientGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ClientGateway.name);
  private server = new Server();
  private activeClients = new Map<string, Socket>();

  addClient(clientId: string, socket: Socket) {
    this.activeClients.set(clientId, socket);
  }

  removeClient(clientId: string) {
    this.activeClients.delete(clientId);
  }

  getAllClients() {
    return this.activeClients;
  }

  handleConnection(client: Socket) {
    this.addClient(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.removeClient(client.id);
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

  broadcastMessage(message: string): void {
    this.server.emit('broadcast', {
      from: `broadcasting system`,
      message: message,
    });
  }
}
