import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { entities } from './utility/entities/entities';
import { getEnv } from './config/configApp';

export const datasourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: getEnv('DB_HOST'),
  port: parseInt(getEnv('DB_PORT')),
  database: getEnv('DB_NAME'),
  username: getEnv('DB_USERNAME'),
  password: getEnv('DB_PASSWORD'),
  entities,
  synchronize: false,
  migrations: [path.join(__dirname, './migration/*.ts')],
};

export default new DataSource(datasourceConfig);
