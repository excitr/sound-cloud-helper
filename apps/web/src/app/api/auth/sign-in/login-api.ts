'use server';
import { prisma } from '@repo/database';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { logger } from '@repo/logger';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/app/modules/constant';
import { type APIResponse, generateAccessToken, generateRefreshToken } from './login-helper.ts';

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

    const cookieStore = await cookies();
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
