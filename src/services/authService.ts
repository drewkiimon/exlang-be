import * as crypto from 'crypto';
import { prisma } from '../../prisma/prisma';

export const generateUniqueSalt = async () => {
  let salt = crypto.randomBytes(128).toString('base64');

  while (await prisma.credential.findUnique({ where: { salt } })) {
    salt = crypto.randomBytes(128).toString('base64');
  }

  return salt.toString('hex');
};

export const hashPassword = async (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
};

export const isPasswordCorrect = (
  saltedPassword: string,
  salt: string,
  password: string
): boolean =>
  crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex') ===
  saltedPassword;
