import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import postsRouter from './routes/posts.js';

const app = new Hono();

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
