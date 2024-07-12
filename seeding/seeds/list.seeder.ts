import { Board } from 'src/board/entities/board.entity';
import { List } from 'src/lists/entities/list.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class ListSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const boardRepository = dataSource.getRepository(Board);
    const boards = await boardRepository.find();

    const listFactory = factoryManager.get(List);
    for (const board of boards) {
      const lists = await listFactory.saveMany(3);
      for (const list of lists) {
        list.board = board;
        await dataSource.getRepository(List).save(list);
      }
    }
  }
}
