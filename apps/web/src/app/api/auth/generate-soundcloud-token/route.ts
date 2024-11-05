'use server';
import { logger } from '@repo/logger';
import { prisma } from '@repo/database';
import { env } from '@/env.mjs';

interface SoundCloudAccount {
  id: number;
  refresh_token: string | null; // Allow null for safety
}

interface TokenResponse {
  refresh_token: string; // Optional as it may not always be present
  access_token: string; // Optional as it may not always be present
  token_type?: string;
  expires_in?: number;
  scope?: string;
}

const clientId = env.CLINT_ID;
const clientSecret = env.CLIENT_SECRET;

export async function POST(): Promise<Response> {
  try {
    const account: SoundCloudAccount | null = await prisma.soundCloudAccount.findFirst({
      where: { id: 3 },
      select: { id: true, refresh_token: true },
    });

    // Ensure account exists and refresh_token is not null
    if (!account?.refresh_token) {
      throw new Error('Refresh token is required');
    }

    const refreshToken: string = account.refresh_token; // TypeScript knows it's not null here

    const url = 'https://secure.soundcloud.com/oauth/token';

    // Prepare the request body
    const data = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId || '',
      client_secret: clientSecret || '',
      refresh_token: refreshToken, // Use the provided refresh token
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data.toString(),
    });

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching access token: ${response.statusText}`);
    }

    const responseData = (await response.json()) as TokenResponse;
    logger.info(responseData, 'Access Token Response:');

    // Check if access_token and refresh_token are present in the response
    if (!responseData.access_token || !responseData.refresh_token) {
      throw new Error('Missing access token or refresh token in the response');
    }

    // Update the refresh_token and access_token in the database
    try {
      await prisma.soundCloudAccount.update({
        where: { id: account.id }, // Use the id from the fetched account
        data: {
          refresh_token: responseData.refresh_token,
          access_token: responseData.access_token,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message); // Access safely as an Error object
      } else {
        logger.error('Unknown error type');
      }
    }

    // Return the access token in the response
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
