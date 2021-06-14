import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users: Prisma.UserCreateInput[] = [
  {
    email: 'someone@example.com',
    emailVerified: new Date(),
    banks: {
      create: [
        {
          currency: 'gbp',
          details: {
            'Account Holder': 'John Doe',
            'Account #': '123456789',
            'Sort Code': '12-34-56',
            IBAN: 'AAAA BBBB 1234 5678 9123 45',
            Address: [
              '**Bank of UK**',
              '99 Royal Street',
              'London',
              'E1 6JJ',
              'United Kingdom',
            ],
          },
        },
        {
          nickname: 'USA Bank',
          currency: 'usd',
          details: {
            'Account Holder': 'John Doe',
            'Routing #': '987654321',
            'Account #': '123456789',
            Address: [
              '**USA Bank**',
              '321 Zeroth Avenue',
              'New York, NY 10001',
              'United States',
            ],
          },
        },
      ],
    },
    clients: {
      create: [
        {
          clockifyId: '601198d882050431e749102d',
          address: [
            '*Mazeika LLC*',
            '123 Main Street',
            'Boston, MA 02115',
            '_Company # 123456789_',
          ],
          billingIncrement: 15,
          billingNetDays: 30,
          billingCurrency: 'usd',
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
