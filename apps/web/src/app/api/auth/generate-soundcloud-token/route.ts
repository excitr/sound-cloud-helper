'use server';
import { logger } from '@repo/logger';
import { prisma } from '@repo/database';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/env.mjs';
import { OAUTH_TOKEN_URL, REFRESH_GRANT_TYPE, SOUNDCLOUD_TOKEN_KEY } from '@/app/modules/constant';
import { getAccountIdFromCookie } from '@/app/lib/common-functions';
import { encodedSoundCloudToken } from '../sign-in/login-helper';

const TokenResponseSchema = z.object({
  refresh_token: z.string(),
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string(),
});

export async function POST(): Promise<Response> {
  try {
    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return NextResponse.json({ success: false });
    }
    const currentTimeMinus10Minutes = new Date(Date.now() - 10 * 60 * 1000); // Get time 10 minutes ago in seconds

    const account = await prisma.soundCloudAccount.findFirst({
      where: {
        id: String(accountId),
        accessTokenExpireAt: {
          lt: currentTimeMinus10Minutes,
        },
      },
    });

    if (!account) {
      return NextResponse.json({ success: true });
    }

    // Prepare the request body
    const data = new URLSearchParams({
      grant_type: REFRESH_GRANT_TYPE,
      client_id: env.SOUNDCLOUD_CLINT_ID,
      client_secret: env.SOUNDCLOUD_CLIENT_SECRET,
      refresh_token: account.refreshToken,
    });

    const response = await fetch(OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: String(data),
    });
    const responseData = TokenResponseSchema.parse(await response.json());

    try {
      await prisma.soundCloudAccount.update({
        where: { id: account.id },
        data: {
          refreshToken: responseData.refresh_token,
          accessToken: responseData.access_token,
          accessTokenExpireAt: new Date(Date.now() + responseData.expires_in * 1000),
        },
      });
      const cookieStore = await cookies();
      cookieStore.set(SOUNDCLOUD_TOKEN_KEY, encodedSoundCloudToken({ access_token: responseData.access_token }));
      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
        return NextResponse.json({ success: false });
      }
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching access token:', error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred', success: false }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
