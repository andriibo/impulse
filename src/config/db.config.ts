import { DataSourceOptions } from 'typeorm';

export const dbConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || '',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  logging: process.env.NODE_ENV === 'development' ? true : false,
} as DataSourceOptions;
