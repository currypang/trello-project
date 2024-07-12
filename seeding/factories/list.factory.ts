import { setSeederFactory } from 'typeorm-extension';

import { Faker } from '@faker-js/faker';
import { List } from 'src/lists/entities/list.entity';

export default setSeederFactory(List, async (faker: Faker) => {
  const list = new List();
  list.name = faker.lorem.words(2);
  list.position = faker.number.int({ min: 1, max: 1000 });
  return list;
});
