import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TableNameEnum } from './enum/table.enum';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource, // Injecting the DataSource object
  ) {}

  // Truncate table based on the provided table name
  async truncateTable(table: TableNameEnum): Promise<string> {
    try {
      // Execute the TRUNCATE command dynamically for any table
      await this.truncateTableQuery(table);
      return `${table} table truncated successfully`;
    } catch (error) {
      throw new Error(`Error truncating table: ${error.message}`);
    }
  }

  // Helper method to execute the TRUNCATE query
  private async truncateTableQuery(tableName: string): Promise<void> {
    // Using the dataSource object to run raw SQL query for truncating tables
    await this.dataSource.query(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`, // Truncate table with CASCADE and reset identity
    );
  }
}
