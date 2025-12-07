import type { Prisma } from '../generated/prisma/client';
import { prisma } from './prisma';

const users: Prisma.UserCreateInput[] = [
  {
    uuid: '00000000-0000-0000-0000-000000000000',
    firstName: 'Alice',
    lastName: 'Wong',
    username: 'ckwong',
    email: 'w.aliceck@gmail.com',
    credential: {
      create: {
        uuid: 'b7a38083-6819-4914-91e3-516a87359d01',
        saltedPassword:
          'f015fe8ef15055115a95128b7ef4f24f673eb4aed799a0ed2a6460f88491620e1784bfb64d2e8e353e4230c935e06bf284bf846a110919e4c03acea105d2b1dc',
        salt: 'nB58xzAVLAeTW75u3tD7aP3GjqravSN6bzsXJHFcMHolP9+7C8xtQ04uJZsyZFBrtIGNuKZZ95Om0bzP1f989jLS47Vv+WH1uKEvQJ0qroO6XimCjPunJYGRW9JLv0Yu6zgIPNN6SOkwkf8g+1XqlJSiGSGSaceKMj2jUpwm7rw=',
      },
    },
  },
  {
    uuid: '11111111-1111-1111-1111-111111111111',
    firstName: 'Andrew',
    lastName: 'Pagan',
    username: 'drewkiimon',
    email: 'drewkiimo@gmail.com',
    credential: {
      create: {
        uuid: 'a07194ae-7d51-4e6d-8af3-98219026da2c',
        saltedPassword:
          '26923d619957789bbe297f31a0260a92849ffa312a87a1e6cc02a6611523ef121c67eaf51fa8356ad3e20b74967838f8626743d5c42fef5611d92f5f8184c5d3',
        salt: 'tyT4UtHzE24M9tq1HHSS21ZzOWalDb/Mnl39AhRI3e7eVEmFiwNvDpDiGaRnyzDYM192B5LvXwcaSFIlmDsYbAgyGGVX+xP/RP8t9k5qoUXlEoSJZautYD1yGD7rBNx/S2WJgSVL+zZaX/k2cCUAgvOfCDLVoyWiLxgL2zK517Q=',
      },
    },
  },
];

const posts: Prisma.PostCreateInput[] = [
  {
    title: 'I was in Tokyo',
    content:
      'I was in Tokyo for a week and it was amazing. I got to see the Tokyo Tower and the Tokyo Skytree.',
    author: {
      connect: { uuid: '00000000-0000-0000-0000-000000000000' },
    },
  },
  {
    title: 'この秋の雨が多すぎる',
    content: '今年の秋は雨の日がとても多かったです。',
    author: {
      connect: { uuid: '11111111-1111-1111-1111-111111111111' },
    },
  },
];

async function main() {
  console.log('\n🌱✨ Starting fancy Prisma seeding process! ✨🌱\n');

  console.log('🌱✨ Creating users... ✨🌱');

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });

    console.log(`✨🌱 Created ${user.firstName} ${user.lastName}! 🌱✨`);
  }

  console.log('🌱✨ Creating posts... ✨🌱');

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log('✨🌱 Created posts! 🌱✨');
  console.log('\n🌱✨ Prisma seeding process completed! ✨🌱\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
