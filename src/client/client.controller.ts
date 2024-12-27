import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { MessageTypeEnum } from './enum/messageType.enum';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('activeClient')
  @ApiOperation({ summary: 'Active socket Client' })
  async getActiveConnection() {
    const connetions = Array.from(this.clientService.getAllClients().keys());
    return {
      Count: connetions.length,
      List: connetions.map((name) => {
        return { name };
      }),
    };
  }

  @Get('/broadcast/:type/:message')
  @ApiOperation({ summary: 'Broadcast message to all clients' })
  async broadCastMessage(
    @Param('message') message: string,
    @Param('type') type: MessageTypeEnum,
  ) {
    this.clientService.broadCastMessage(type, message);
    return 'message broadcasted to all clients';
  }
}
