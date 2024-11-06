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

const clientId = env.SOUNDCLOUD_CLINT_ID;
const clientSecret = env.SOUNDCLOUD_CLIENT_SECRET;

export async function POST(): Promise<Response> {
  try {
    const account = await prisma.soundCloudAccount.findFirst({
      where: { id: 3 },
    });

    if (!account?.refreshToken) {
      throw new Error('Refresh token is required');
    }

    // Prepare the request body
    const data = new URLSearchParams({
      grant_type: REFRESH_GRANT_TYPE,
      client_id: clientId || '',
      client_secret: clientSecret || '',
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
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error('Unknown error type');
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
