'use server';

import { cookies } from 'next/headers';
import { SOUNDCLOUD_ACCOUNT_ID, SOUNDCLOUD_TOKEN_KEY } from '../modules/constant';
import { decodedSoundCloudToken } from '../api/auth/sign-in/login-helper';

export const getSoudCloudeTokenFromCookie = async (): Promise<string | null> => {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get(SOUNDCLOUD_TOKEN_KEY);
  const accessToken = cookie?.value;
  if (!accessToken) {
    return Promise.resolve(null);
  }

  const decodedToken = decodedSoundCloudToken(accessToken);

  if (decodedToken && typeof decodedToken === 'object' && 'access_token' in decodedToken) {
    return Promise.resolve(decodedToken.access_token as string);
  }

  return Promise.resolve(null);
};

export const getAccountIdFromCookie = async (): Promise<string | null> => {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get(SOUNDCLOUD_ACCOUNT_ID);
  const accountId = cookie?.value;
  if (!accountId) {
    return Promise.resolve(null);
  }

  const decodedToken = decodedSoundCloudToken(accountId);

  if (decodedToken && typeof decodedToken === 'object' && 'id' in decodedToken) {
    return Promise.resolve(decodedToken.id as string);
  }

  return Promise.resolve(null);
};

// export const generateAccessToken = (user: { id: number; email: string }): string =>
//   sign({ id: user.id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });

// export const generateRefreshToken = (user: { id: number; email: string }): string =>
//   sign({ id: user.id, email: user.email }, env.REFRESH_TOKEN_SECRET, { expiresIn: '131400m' });

// export const verifyAccessToken = (token: string): string | JwtPayload => verify(token, env.ACCESS_TOKEN_SECRET);

// export const verifyRefreshToken = (token: string): string | JwtPayload => verify(token, env.REFRESH_TOKEN_SECRET);

// export const encodedSoundCloudToken = (user: { access_token: string }): string =>
//   sign({ access_token: user.access_token }, env.ACCESS_TOKEN_SECRET);

// export const decodedSoundCloudToken = (token: string): string | JwtPayload => verify(token, env.ACCESS_TOKEN_SECRET);
