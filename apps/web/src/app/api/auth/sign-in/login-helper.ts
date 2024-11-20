import { type JwtPayload, sign, verify } from 'jsonwebtoken';
import { env } from '@/env.mjs';

export const generateAccessToken = (user: { id: number; email: string }): string =>
  sign({ id: user.id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '15778800' });

export const generateRefreshToken = (user: { id: number; email: string }): string =>
  sign({ id: user.id, email: user.email }, env.REFRESH_TOKEN_SECRET, { expiresIn: '15778800' });

export const verifyAccessToken = (token: string): string | JwtPayload => verify(token, env.ACCESS_TOKEN_SECRET);

export const verifyRefreshToken = (token: string): string | JwtPayload => verify(token, env.REFRESH_TOKEN_SECRET);

export const encodedSoundCloudToken = (user: { access_token: string }): string =>
  sign({ access_token: user.access_token }, env.ACCESS_TOKEN_SECRET);
export const encodedSoundCloudAccountId = (user: { id: string }): string =>
  sign({ id: user.id }, env.ACCESS_TOKEN_SECRET);

export const decodedSoundCloudToken = (token: string): string | JwtPayload => verify(token, env.ACCESS_TOKEN_SECRET);

export const decodedSoundCloudAccountId = (id: string): string | JwtPayload => verify(id, env.ACCESS_TOKEN_SECRET);

export interface APIResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  error?: string;
}
