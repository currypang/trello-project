import { setSeederFactory } from 'typeorm-extension';

import { Faker } from '@faker-js/faker';
import { Board } from 'src/board/entities/board.entity';

export default setSeederFactory(Board, (faker: Faker) => {
  const board = new Board();
  board.name = faker.lorem.words(3);
  board.background_color = '#FF0000';
  return board;
});
