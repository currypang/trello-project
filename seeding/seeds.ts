import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import UserSeeder from './seeds/user.seeder';
import UserFactory from './factories/user.factory';
import { User } from 'src/user/entities/user.entity';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { Board } from 'src/board/entities/board.entity';
import { List } from 'src/lists/entities/list.entity';
import { Card } from 'src/cards/entities/card.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import BoardSeeder from './seeds/board.seeder';
import boardFactory from './factories/board.factory';
import { CardAssigness } from 'src/cards/entities/card-assigness.entity';
import ListSeeder from './seeds/list.seeder';
import listFactory from './factories/list.factory';
import CardSeeder from './seeds/card.seeder';
import cardFactory from './factories/card.factory';
import cardAssaignessFactory from './factories/card-assaigness.factory';

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: 'express-database.cxk8yoee01tj.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    username: 'root',
    password: '0213porta',
    database: 'luke',
    synchronize: true,
    entities: [User, Board, BoardMembers, List, Card, CardAssigness, Activity],
    seeds: [UserSeeder, BoardSeeder, ListSeeder, CardSeeder],
    factories: [UserFactory, boardFactory, listFactory, cardFactory, cardAssaignessFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await runSeeders(dataSource);
  console.log('Seeding completed.');
  process.exit();
})();
