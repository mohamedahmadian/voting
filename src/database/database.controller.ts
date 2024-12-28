import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TableNameEnum } from './enum/table.enum';
import { ApiParam } from '@nestjs/swagger';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get(':table')
  @ApiParam({
    name: 'table',
    description: 'The name of the table to truncate',
    enum: TableNameEnum, // This will expose the enum values in Swagger
    example: TableNameEnum.users, // Example value in Swagger UI
  })
  async truncateTable(@Param('table') table: TableNameEnum): Promise<string> {
    // Call the DatabaseService to truncate the table
    return this.databaseService.truncateTable(table);
  }
}
