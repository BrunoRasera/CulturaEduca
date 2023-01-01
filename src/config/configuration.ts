import { SequelizeModuleOptions } from '@nestjs/sequelize';
import 'dotenv/config';

const databaseOptions = {
  development: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  test: {
    host: process.env.DB_TEST_HOST,
    port: Number(process.env.DB_TEST_PORT),
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
  },
  production: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

const database: SequelizeModuleOptions = {
  ...databaseOptions[process.env.NODE_ENV || 'development'],
  dialect: 'postgres',
  autoLoadModels: true,
  logging: false,
  minifyAliases: true,
  repositoryMode: true,
  synchronize: false,
};

export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  database,
  swaggerServer: process.env.SWAGGER_SERVER,
});
