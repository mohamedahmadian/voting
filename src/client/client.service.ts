import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageTypeEnum } from './enum/messageType.enum';
import { ClientGateway } from './client.gateway';
import { VoteReportService } from 'src/vote/vote.report.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly voteReportService: VoteReportService,
    private readonly clientGateway: ClientGateway,
  ) {}

  getAllClients() {
    return this.clientGateway.getAllClients();
  }

  async broadCastMessage(type: MessageTypeEnum, messageOrPollId: string) {
    let message: any = messageOrPollId;
    if (type == MessageTypeEnum.poll) {
      const pollId = parseInt(messageOrPollId, 10);

      if (isNaN(pollId)) {
        throw new BadRequestException('Invalid poll ID, it must be a number.');
      }
      message = await this.voteReportService.getPollReport(
        parseInt(messageOrPollId),
      );
    }
    this.clientGateway.broadcastMessage(message);
  }
}
