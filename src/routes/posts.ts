import { Hono } from 'hono';
import { createPost, getPosts } from '@/services/postsService';

const postsRouter = new Hono();

postsRouter.get('/', async (c) => {
  const posts = await getPosts();

  return c.json(
    {
      posts,
    },
    200
  );
});

postsRouter.post('/', async (c) => {
  const req = await c.req.json();
  const jwtPayload = c.get('jwtPayload');

  const post = await createPost({
    title: req.title,
    content: req.content,
    author: {
      connect: {
        uuid: jwtPayload.userUuid,
      },
    },
  });

  return c.json(
    {
      post,
    },
    201
  );
});

export default postsRouter;
