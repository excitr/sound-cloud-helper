'use server';
import { prisma } from '@repo/database';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { logger } from '@repo/logger/src';

const TOKEN_KEY = 'sound_cloud_token';
const REFRESH_TOKEN_KEY = 'sound_cloud_refresh_token';

export const generateAccessToken = (user: { id: string }): Promise<string> => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  return new Promise((resolve, reject) => {
    sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' }, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      if (!token) {
        reject(new Error('Token generation failed'));
        return;
      }
      resolve(token);
    });
  });
};

export const generateRefreshToken = (user: { id: string }): Promise<string> => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!refreshTokenSecret) {
    return Promise.reject(new Error('REFRESH_TOKEN_SECRET is not defined'));
  }

  return new Promise((resolve, reject) => {
    sign({ id: user.id }, refreshTokenSecret, { expiresIn: '30d' }, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      if (!token) {
        reject(new Error('Token generation failed'));
        return;
      }
      resolve(token);
    });
  });
};

export const verifyAccessToken = (token: string): string | JwtPayload => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  return verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string): Promise<JwtPayload> => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }

  return new Promise((resolve, reject) => {
    verify(token, refreshTokenSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
};

export interface APIResponce {
  success: boolean;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export async function getUserByEmailAndPassword(data: { email: string; password: string }): Promise<APIResponce> {
  try {
    const user = await prisma.user.findFirst({
      where: { contactEmail: data.email },
      select: { id: true, password: true, contactEmail: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'User Not Found',
      };
    }

    const passwordMatch = await compare(data.password, user.password ? user.password : '');

    if (!passwordMatch) {
      return {
        success: false,
        error: 'Password Not Match',
      };
    }

    const accessToken = await generateAccessToken({ id: user.contactEmail ? user.contactEmail : '' });
    const refreshToken = await generateRefreshToken({ id: user.contactEmail ? user.contactEmail : '' });

    const cookieStore = cookies();
    cookieStore.set(TOKEN_KEY, accessToken);
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken);
    return {
      success: true,
      token: accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error('error', error);
    return {
      success: false,
    };
  }
}
