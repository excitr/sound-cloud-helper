'use server';
import { logger } from '@repo/logger';
import { prisma } from '@repo/database';
import { z } from 'zod';
import { env } from '@/env.mjs';
import { OAUTH_TOKEN_URL, REFRESH_GRANT_TYPE } from '@/app/modules/constant';

const TokenResponseSchema = z.object({
  refresh_token: z.string(),
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string(),
});

export async function POST(): Promise<Response> {
  try {
    const currentTimeMinus10Minutes = new Date(Date.now() - 10 * 60 * 1000); // Get time 10 minutes ago in seconds

    const account = await prisma.soundCloudAccount.findFirst({
      where: {
        accessTokenExpireAt: {
          lt: currentTimeMinus10Minutes,
        },
      },
    });

    if (!account) {
      throw new Error('Account not found');
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
      body: data.toString(),
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
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      }
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching access token:', error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
