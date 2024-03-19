import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConnectionOptions } from './db.config';

const dataSourceOptions = {
  ...dbConnectionOptions,
  entities: [
    process.cwd() + '/src/infrastructure/modules/**/models/*.model{.ts,.js}',
  ],
  migrations: [process.cwd() + '/database/migrations/*{.ts,.js}'],
  synchronize: false,
} as DataSourceOptions;

export const connectionSource = new DataSource(dataSourceOptions);
