import { Hono } from 'hono';
import { prisma } from '../../prisma/prisma';
import { createUser } from '@/services/authService';
import { sign } from 'hono/jwt';
import { JWT_SECRET } from '@/utils/secrets';

const authRouter = new Hono();

authRouter.post('/sign-up', async (c) => {
  const { email, credentials, firstName, lastName } = await c.req.json();

  const [username, password] = atob(credentials).split(':');

  const existingUser = await prisma.user.findFirst({
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
  const isExistingUser = !!existingUser;

  if (isExistingUser) {
    return c.json({ error: 'User already exists' }, 400);
  }

  const user = await createUser({
    email,
    username,
    password,
    firstName,
    lastName,
  });

  console.log(`User ${user.uuid} created`);

  const token = await sign(
    {
      userUuid: user.uuid,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    },
    JWT_SECRET
  );

  return c.json({ token }, 201);
});

export default authRouter;
