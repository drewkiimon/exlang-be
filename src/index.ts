import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import postsRouter from './routes/posts.js';
import { cors } from 'hono/cors';

const app = new Hono();

// All for all commands, get for only cors on get
app.all(
  '*',
  cors({
    origin: 'http://localhost:3000',
  })
);

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
