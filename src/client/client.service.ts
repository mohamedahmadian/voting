import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';

@Injectable()
export class ClientService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
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

  getAllClientsCount(): number {
    return this.activeClients.size;
  }

  broadCastMessage(message: string) {
    this.eventEmitter.emit('broadcastIt', message);
  }
}
