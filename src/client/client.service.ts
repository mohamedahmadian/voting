import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientService {
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
}
