import { Hono } from 'hono';
import { prisma } from '../../prisma/prisma';

const authRouter = new Hono();

authRouter.post('/sign-up', async (c) => {
  console.log('sign-up');
  const { email, credentials } = await c.req.json();

  const [username, password] = atob(credentials).split(':');

  const existingUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          email,
        },
        {
          username,
        },
      ],
    },
  });

  console.log(email, username, password);

  if (existingUsers.length > 0) {
    return c.json({ error: 'User already exists' }, 400);
  }

  //   const user = await prisma.user.create({
  //     data: {
  //       email,
  //       username,
  //       credential: {
  //         create: {
  //           saltedPassword: password,
  //           salt: '1234',
  //         },
  //       },
  //     },
  //   });

  return c.json({ message: 'User created' }, 201);
});

export default authRouter;
