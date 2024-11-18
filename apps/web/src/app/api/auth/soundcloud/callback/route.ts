'use server';

import { NextResponse } from 'next/server';
import { prisma, type Prisma } from '@repo/database';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { type JwtPayload, verify } from 'jsonwebtoken';
import { env } from '@/env.mjs';
import {
  GRANT_TYPE,
  SOUNDCLOUD_ACCOUNT_ID,
  SOUNDCLOUD_ME_URL,
  SOUNDCLOUD_TOKEN_KEY,
  TOKEN_KEY,
  TOKEN_URL,
} from '@/app/modules/constant.ts';
import { encodedSoundCloudAccountId, encodedSoundCloudToken } from '../../sign-in/login-helper';

interface CustomJwtPayload extends JwtPayload {
  id: number;
}

const MeDataSchema = z.object({
  id: z.number(),
  username: z.string(),
});

const TokenInfoSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
});

type MeData = z.infer<typeof MeDataSchema>;

type TokenInfo = z.infer<typeof TokenInfoSchema>;

const getUserIdFromCookie = async (): Promise<number | null> => {
  const cookieStore = await cookies(); // Await the promise returned by cookies()
  const userData = cookieStore.get(TOKEN_KEY);

  if (userData) {
    const decoded = verify(userData.value, env.ACCESS_TOKEN_SECRET) as CustomJwtPayload;

    return decoded.id; // Directly return the user ID
  }

  return null;
};

const fetchTokenInfo = async (authorizationCode: string): Promise<TokenInfo> => {
  const data = new URLSearchParams({
    client_id: env.SOUNDCLOUD_CLINT_ID,
    client_secret: env.SOUNDCLOUD_CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: env.SOUNDCLOUD_REDIRECT_URL,
    grant_type: GRANT_TYPE,
    code_verifier: env.CODE_VERIFIER,
  });
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error fetching token: ${errorText}`);
  }

  return TokenInfoSchema.parse(await response.json());
};

const fetchMeData = async (accessToken: string): Promise<MeData> => {
  const response = await fetch(SOUNDCLOUD_ME_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return MeDataSchema.parse(await response.json());
};

export async function GET(request: Request): Promise<NextResponse | null> {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');

  if (!authorizationCode) {
    return null;
  }

  const userId = await getUserIdFromCookie();

  try {
    const tokenInfo = await fetchTokenInfo(authorizationCode);

    const meData: MeData = await fetchMeData(tokenInfo.access_token);

    const cookieStore = await cookies();

    cookieStore.set(SOUNDCLOUD_TOKEN_KEY, encodedSoundCloudToken({ access_token: tokenInfo.access_token }));

    const inputData: Prisma.SoundCloudAccountCreateInput = {
      userId: Number(userId),
      accessToken: tokenInfo.access_token,
      accessTokenExpireAt: new Date(Date.now() + tokenInfo.expires_in * 1000),
      refreshToken: tokenInfo.refresh_token,
      soundCloudAccountId: Number(meData.id),
      username: meData.username,
    };

    const insertedData = await prisma.soundCloudAccount.upsert({
      where: {
        userId_soundCloudAccountId: { userId: Number(userId), soundCloudAccountId: Number(meData.id) },
      },
      update: inputData,
      create: inputData,
    });
    cookieStore.set(SOUNDCLOUD_ACCOUNT_ID, encodedSoundCloudAccountId({ id: String(insertedData.id) }));

    return NextResponse.redirect(new URL('/home', request.url));
  } catch (error) {
    return null;
    //return logAndRespondError(`Request failed: ${(error as Error).message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
