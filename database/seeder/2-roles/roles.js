const faker = require('faker');
const uuid = require('uuid');

module.exports = [
  {
    _id: uuid.v4(),
    name: 'User',
    slug: 'user',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    _id: uuid.v4(),
    name: 'Moderator',
    slug: 'Moderator',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    _id: uuid.v4(),
    name: 'Admin',
    slug: 'admin',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
];
