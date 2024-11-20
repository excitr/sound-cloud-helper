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
    return Promise.resolve(String(decodedToken.id));
  }

  return Promise.resolve(null);
};
