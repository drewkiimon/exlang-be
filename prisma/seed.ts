import type { Prisma } from '../generated/prisma/client';
import { prisma } from './prisma';

const users: Prisma.$UserPayload<DefaultArgs>[] = [
  {
    firstName: 'Alice',
    lastName: 'Wong',
    username: 'ckwong',
    email: 'w.aliceck@gmail.com',
  },
];

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
