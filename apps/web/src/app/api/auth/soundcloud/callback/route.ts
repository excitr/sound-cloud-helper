'use server';

import { NextResponse } from 'next/server';
import { prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { cookies } from 'next/headers';
import { type JwtPayload, verify } from 'jsonwebtoken';
import { env } from '@/env.mjs';
import { GRANT_TYPE, TOKEN_URL, USER_ID } from '@/app/modules/constant.ts';

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
};

interface TokenInfo {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: number;
}

interface SoundCloudAccount {
  id: number;
  soundCloudAccountId: number;
}

const logAndRespondError = (error: string, status: number): NextResponse<{ error: string }> => {
  logger.error(error);
  return NextResponse.json({ error }, { status });
};

interface MeData {
  id: number;
  username: string;
  // Add other properties based on the actual response structure
}

const getUserIdFromCookie = async (): Promise<number> => {
  const cookieStore = await cookies(); // Await the promise returned by cookies()
  const userData = cookieStore.get(USER_ID);

  if (userData) {
    const decoded = verify(userData.value, env.ACCESS_TOKEN_SECRET) as CustomJwtPayload;
    logger.info(decoded, 'Decoded ID:');
    return decoded.id; // Directly return the user ID
  }

  return 0; // Return 0 if no userData is found
};

const fetchTokenInfo = async (authorizationCode: string): Promise<TokenInfo> => {
  const data = new URLSearchParams({
    client_id: env.CLINT_ID,
    client_secret: env.CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: env.REDIRECT_URL,
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

  return response.json() as Promise<TokenInfo>; // Ensure this returns TokenInfo
};

const fetchMeData = async (accessToken: string): Promise<MeData> => {
  const response = await fetch('https://api.soundcloud.com/me', {
    method: 'GET',
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return response.json() as Promise<MeData>; // Ensure the return type is MeData
};

const upsertSoundCloudAccount = async (
  accountId: number | undefined,
  inputData: Prisma.SoundCloudAccountCreateInput,
): Promise<void> => {
  if (accountId) {
    await prisma.soundCloudAccount.update({
      where: { id: accountId },
      data: inputData,
    });
  } else {
    await prisma.soundCloudAccount.create({ data: inputData });
  }
};

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');

  if (!authorizationCode) {
    return logAndRespondError('Authorization code is missing', HTTP_STATUS.BAD_REQUEST);
  }

  const userId = await getUserIdFromCookie();

  try {
    const tokenInfo = await fetchTokenInfo(authorizationCode);
    const meData: MeData = await fetchMeData(tokenInfo.access_token);

    const account: SoundCloudAccount | null = await prisma.soundCloudAccount.findFirst({
      where: { soundCloudAccountId: meData.id },
      select: { id: true, soundCloudAccountId: true },
    });

    const inputData: Prisma.SoundCloudAccountCreateInput = {
      userId: Number(userId),
      access_token: tokenInfo.access_token,
      refresh_token: tokenInfo.refresh_token,
      soundCloudAccountId: Number(meData.id),
      username: meData.username,
    };

    await upsertSoundCloudAccount(account?.id, inputData);
    return NextResponse.redirect(new URL('/home', request.url));
  } catch (error) {
    return logAndRespondError(`Request failed: ${(error as Error).message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
