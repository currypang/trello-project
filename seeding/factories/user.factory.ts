import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

export default setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = bcrypt.hashSync('password', 10);
  user.username = faker.internet.userName();

  return user;
});
