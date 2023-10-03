import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '0972155055',
  database: 'demo',
  entities: [join(__dirname, '../**/*.entity{.js,.ts}')],
  migrations: [join(__dirname, '../migrations/*{.js,.ts}')],
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
