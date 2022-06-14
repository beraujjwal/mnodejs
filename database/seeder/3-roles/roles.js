module.exports = [
  {
    _id: '511b3a15-7284-4ab4-8c8a-1aef3f6d258f',
    name: 'Administrator',
    slug: 'administrator',
    deleted: false,
    rights: [
      {
        resource: 'root',
        full: true,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3c485dfa-e0c8-442f-9845-f64cbe540c58',
    name: 'Editor',
    slug: 'editor',
    deleted: false,
    rights: [
      {
        resource: 'root',
        deny: true,
      },
      {
        resource: 'users',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      {
        resource: 'roles',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      {
        resource: 'resources',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      {
        resource: 'permission',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'f94af525-d002-40ac-aab6-d1d170becded',
    name: 'Author',
    slug: 'author',
    deleted: false,
    rights: [
      {
        resource: 'root',
        deny: true,
      },
      {
        resource: 'users',
        create: true,
        read: true,
        update: false,
        delete: false,
      },
      {
        resource: 'roles',
        create: true,
        read: true,
        update: false,
        delete: false,
      },
      {
        resource: 'resources',
        create: true,
        read: true,
        update: false,
        delete: false,
      },
      {
        resource: 'permission',
        deny: true,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'b9e81851-6a3a-40a1-b05c-9839892452c6',
    name: 'Contributor',
    slug: 'contributor',
    deleted: false,
    rights: [
      {
        resource: 'root',
        deny: true,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '38bfa5dd-0807-4ffd-9fac-bf54ca6ae3ec',
    name: 'Subscriber',
    slug: 'subscriber',
    deleted: false,
    rights: [
      {
        resource: 'root',
        deny: true,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
