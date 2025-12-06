import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import postsRouter from './routes/posts.js';
import { cors } from 'hono/cors';
import authRouter from './routes/auth.js';

const app = new Hono();

// All for all commands, get for only cors on get
app.all(
  '*',
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.use(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  // Example condition: Only allow requests with a custom header 'x-auth-token'
  // const authToken = c.req.header('x-auth-token');
  // if (!authToken) {
  //   return c.json({ error: 'Unauthorized: missing x-auth-token' }, 401);
  // }
  await next();
});

app.route('/api/auth', authRouter);
app.route('/api/posts', postsRouter);

serve(
  {
    fetch: app.fetch,
    port: parseInt(process.env.PORT || '4000'),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
