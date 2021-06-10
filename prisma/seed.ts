import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users: Prisma.UserCreateInput[] = [
  {
    email: 'mazeika.tj@gmail.com',
    emailVerified: new Date(),
    clients: {
      create: [
        {
          name: 'Sample & Co',
        },
      ],
    },
  },
  {
    email: 'tj@mazeika.dev',
    emailVerified: new Date(),
    clients: {
      create: [
        {
          name: 'Mazeika LLC',
          projects: {
            create: [
              {
                name: 'GigBook',
              },
              {
                name: 'Freelancer',
              },
            ],
          },
        },
        {
          name: 'Acme, Inc.',
          projects: {
            create: [
              {
                name: 'YourTrains',
              },
              {
                name: 'MyTickets',
              },
            ],
          },
        },
      ],
    },
  },
];

void (async (): Promise<void> => {
  try {
    for (const data of users) {
      await prisma.user.create({ data });
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
