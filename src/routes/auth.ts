import { Hono } from 'hono';
import { prisma } from '../../prisma/prisma';
import { createUser } from '../services/authService';

const authRouter = new Hono();

authRouter.post('/sign-up', async (c) => {
  console.log('sign-up');
  const { email, credentials, firstName, lastName } = await c.req.json();

  const [username, password] = atob(credentials).split(':');
  console.log('AAA', username, email);
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

  return c.json({ message: 'User created' }, 201);
});

export default authRouter;
