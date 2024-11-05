'use server';
import { prisma } from '@repo/database';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { logger } from '@repo/logger';
import { NextResponse } from 'next/server';
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

    const passwordMatch = await compare(data.password, user.password ?? '');

    if (!passwordMatch) {
      return {
        success: false,
        error: 'Incorrect credentials',
      };
    }

    const accessToken = generateAccessToken({ id: user.contactEmail ?? '' });
    const refreshToken = generateRefreshToken({ id: user.contactEmail ?? '' });

    // Create a response to set cookies
    const response = NextResponse.json({
      success: true,
      token: accessToken,
      refreshToken,
      id: user.id,
    });

    // Set tokens in cookies
    response.cookies.set(TOKEN_KEY, accessToken, { httpOnly: true, secure: true });
    response.cookies.set(REFRESH_TOKEN_KEY, refreshToken, { httpOnly: true, secure: true });
    response.cookies.set(USER_ID, sign({ id: user.id }, env.ACCESS_TOKEN_SECRET), { httpOnly: true, secure: true });

    return {
      success: true,
      token: accessToken,
      refreshToken,
      id: user.id,
    }; // Return the response with cookies set
  } catch (error) {
    logger.error('Error:', error);
    return {
      success: false,
    };
  }
}
