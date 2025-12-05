import { Hono } from 'hono';
import { cors } from 'hono/cors';

const posts = [
  {
    id: 1,
    title: 'First Post',
    body: 'This is the body of the first post.',
  },
  {
    id: 2,
    title: '一番目の投稿',
    body: 'これは一番目の投稿の本文です',
  },
  {
    id: 3,
    title: 'Third Post',
    body: 'This is the third dummy post in the feed.',
  },
];

const postsRouter = new Hono();

postsRouter.get('/*', cors());

postsRouter.get('/', (c) => {
  return c.json({
    posts,
  });
});

postsRouter.post('/', async (c) => {
  const req = await c.req.json();
  console.log('AAA ', req.content);
  const newPost = {
    id: posts.length + 1,
    title: 'New Post',
    body: req.content,
  };

  posts.push(newPost);

  return c.json({
    post: newPost,
  });
});

export default postsRouter;
