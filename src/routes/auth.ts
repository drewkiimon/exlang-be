import { Hono } from 'hono';
import { prisma } from '@prisma/prisma';
import { createUser, isPasswordCorrect } from '@/services/authService';
import { sign, verify } from 'hono/jwt';
import { JWT_SECRET } from '@/utils/secrets';

const authRouter = new Hono();

authRouter.post('/validate-token', async (c) => {
  const token = c.req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const verified = await verify(token, JWT_SECRET); // This just decodes; it doesn't validate integrity.

  const user = await prisma.user.findUniqueOrThrow({
    where: { uuid: verified.userUuid as string },
  });

  return c.json(
    {
      token,
      user: {
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    },
    200
  );
});

authRouter.post('/sign-in', async (c) => {
  const { credentials } = await c.req.json();

  if (!credentials) {
    return c.json({ error: 'Credentials are required' }, 400);
  }

  const [username, password] = atob(credentials).split(':');

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      credential: true,
    },
  });

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const isPasswordValid = isPasswordCorrect(
    user.credential.saltedPassword,
    user.credential.salt,
    password
  );

  if (!isPasswordValid) {
    return c.json({ error: 'Invalid password' }, 401);
  }

  const token = await sign(
    {
      userUuid: user.uuid,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    },
    JWT_SECRET
  );

  return c.json(
    {
      token,
      user: {
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    },
    200
  );
});

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

  const token = await sign(
    {
      userUuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    },
    JWT_SECRET
  );

  return c.json(
    {
      token,
      user: {
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    },
    201
  );
});

export default authRouter;
