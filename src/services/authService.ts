import * as crypto from 'crypto';
import { prisma } from '@prisma/prisma';

export const generateUniqueSalt = async () => {
  let salt = crypto.randomBytes(128).toString('base64');

  while (await prisma.credential.findFirst({ where: { salt } })) {
    salt = crypto.randomBytes(128).toString('base64');
  }

  return salt;
};

export const saltPassword = async (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

export const isPasswordCorrect = (
  saltedPassword: string,
  salt: string,
  password: string
): boolean =>
  crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex') ===
  saltedPassword;

export const createUser = async ({
  firstName,
  lastName,
  email,
  username,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}) => {
  const salt = await generateUniqueSalt();
  const saltedPassword = await saltPassword(password, salt);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      credential: {
        create: {
          saltedPassword,
          salt,
        },
      },
    },
  });

  return user;
};
