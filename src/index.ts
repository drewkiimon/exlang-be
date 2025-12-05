import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.get('/posts/*', cors());

app.get('/posts', (c) => {
  return c.json({
    posts: [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
      },
    ],
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
