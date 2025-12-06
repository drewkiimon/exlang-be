import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import postsRouter from './routes/posts.js';
import { cors } from 'hono/cors';
import authRouter from './routes/auth.js';
import { jwt, verify } from 'hono/jwt';

const app = new Hono();

// All for all commands, get for only cors on get
app.all(
  '*',
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.route('/api/auth', authRouter);

// Below, you must be authenticated to access the routes
app
  .use(
    jwt({
      secret: 'change_me_later_please',
    })
  )
  .onError((err, c) => {
    return c.json({ error: 'Unauthorized' }, 401);
  });

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
