import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';

import postsRouter from '@/routes/posts.js';
import authRouter from '@/routes/auth.js';
import { JWT_SECRET } from '@/utils/secrets';

const app = new Hono();

app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.path}`);
  await next();
});

// All for all commands, get for only cors on get
app.all(
  '*',
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.route('/api/auth', authRouter);
// https://stackoverflow.com/questions/27301557/if-you-can-decode-jwt-how-are-they-secure
// Below, you must be authenticated to access the routes

app
  .use(
    jwt({
      secret: JWT_SECRET,
    })
  )
  .onError((_err, c) => {
    console.log('AAA error', _err);
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
