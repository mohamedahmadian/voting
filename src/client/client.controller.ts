import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('activeClient')
  @ApiOperation({ summary: 'Active Client' })
  async getActiveConnection() {
    const connetions = Array.from(this.clientService.getAllClients().keys());
    return {
      Count: connetions.length,
      List: connetions.map((name) => {
        return { name };
      }),
    };
  }

  @Get('activeClientCount')
  @ApiOperation({ summary: 'Active Client counts' })
  async getActiveConnectionCounts() {
    return {
      'Active Connection Count': this.clientService.getAllClientsCount(),
    };
  }

  @Get('/broadcast/:message')
  @ApiOperation({ summary: 'Broadcast message to all clients' })
  async broadCastMessage(@Param('message') message: string) {
    this.clientService.broadCastMessage(message);
    return 'message broadcasted to all clients';
  }
}
