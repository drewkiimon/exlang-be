import { Hono } from 'hono';

const posts = [
  {
    id: 1,
    title: 'First Post',
    body: 'This is the body of the first post.',
    created_at: new Date('2025-12-05T08:00:00Z'),
  },
  {
    id: 2,
    title: '一番目の投稿',
    body: 'これは一番目の投稿の本文です',
    created_at: new Date('2025-12-05T10:00:00Z'),
  },
  {
    id: 3,
    title: 'Third Post',
    body: 'This is the third dummy post in the feed.',
    created_at: new Date('2025-12-05T12:00:00Z'),
  },
];

const postsRouter = new Hono();

postsRouter.get('/', (c) => {
  return c.json({
    posts,
  });
});

postsRouter.post('/', async (c) => {
  const req = await c.req.json();

  const newPost = {
    id: posts.length + 1,
    title: 'New Post',
    body: req.content,
    created_at: new Date(),
  };

  posts.push(newPost);

  return c.json({
    post: newPost,
  });
});

export default postsRouter;
