import { prisma } from '@prisma/prisma';
import { Hono } from 'hono';

const usersRouter = new Hono();

usersRouter.get('/me', async (c) => {
  const jwtPayload = c.get('jwtPayload');

  const user = await prisma.user.findUnique({
    where: {
      uuid: jwtPayload.userUuid,
    },
  });

  return c.json({
    user,
  });
});

export default usersRouter;
