import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { MessageTypeEnum } from './enum/messageType.enum';
import { VoteService } from '../vote/vote.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly voteService: VoteService,
  ) {}
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

  async broadCastMessage(type: MessageTypeEnum, messageOrPollId: string) {
    let message: any = messageOrPollId;
    if (type == MessageTypeEnum.poll) {
      message = await this.voteService.getPollReport(parseInt(messageOrPollId));
    }
    this.eventEmitter.emit('broadcastMessage', message);
  }
}
