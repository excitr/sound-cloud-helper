import { NextResponse } from 'next/server';
import { logger } from '@repo/logger';
import { cookies } from 'next/headers';
import { type JwtPayload, sign, verify } from 'jsonwebtoken';
import { env } from '@/env.mjs';
import { SOUNDCLOUD_TOKEN_KEY } from '../modules/constant';

export const logAndRespondError = (error: string, status: number): NextResponse<{ error: string }> => {
  logger.error(error);
  return NextResponse.json({ error }, { status });
};

export const getSoudCloudeTokenFromCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(SOUNDCLOUD_TOKEN_KEY)?.value;

  return accessToken ?? null;
};

export const generateAccessToken = (user: { id: number; email: string }): string =>
  sign({ id: user.id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });

export const generateRefreshToken = (user: { id: number; email: string }): string =>
  sign({ id: user.id, email: user.email }, env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' });

export const verifyAccessToken = (token: string): string | JwtPayload => verify(token, env.ACCESS_TOKEN_SECRET);

export const verifyRefreshToken = (token: string): string | JwtPayload => verify(token, env.REFRESH_TOKEN_SECRET);
