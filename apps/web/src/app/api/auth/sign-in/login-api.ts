'use server';
import { prisma } from '@repo/database';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { logger } from '@repo/logger';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID } from '@/app/modules/constant';
import { env } from '@/env.mjs';
import { generateAccessToken, generateRefreshToken } from './login-helper';

export interface APIResponse {
  success: boolean;
  id?: number;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export async function getUserByEmail(data: { email: string; password: string }): Promise<APIResponse> {
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
        error: 'Incorrect credentials',
      };
    }

    const accessToken = generateAccessToken({ id: user.contactEmail ? user.contactEmail : '' });
    const refreshToken = generateRefreshToken({ id: user.contactEmail ? user.contactEmail : '' });

    const cookieStore = cookies();
    cookieStore.set(TOKEN_KEY, accessToken);
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken);
    cookieStore.set(USER_ID, sign({ id: user.id }, env.ACCESS_TOKEN_SECRET));

    return {
      success: true,
      token: accessToken,
      refreshToken,
      id: user.id,
    };
  } catch (error) {
    logger.error('error', error);
    return {
      success: false,
    };
  }
}
