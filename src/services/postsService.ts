import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '@prisma/prisma';

export const getPosts = async () =>
  prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
    },
  });

export const createPost = async (post: Prisma.PostCreateInput) => {
  const createdPost = await prisma.post.create({
    data: post,
    select: {
      author: {
        select: {
          uuid: true,
          username: true,
        },
      },
    },
  });

  return createdPost;
};
