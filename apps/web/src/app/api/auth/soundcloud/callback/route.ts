'use server';

import { NextResponse } from 'next/server';
import { prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { cookies } from 'next/headers';
import { type JwtPayload, verify } from 'jsonwebtoken';
import { env } from '@/env.mjs';
import { GRANT_TYPE, TOKEN_URL, USER_ID } from '@/app/modules/constant.ts';

const clientId = env.CLINT_ID;
const clientSecret = env.CLIENT_SECRET;
const redirectUri = env.REDIRECT_URL;
const codeVerifier = env.CODE_VERIFIER;

interface TokenInfo {
  access_token: string;
  expires_in: number;
  refresh_token: string; // Optional, if not always present
}

interface CustomJwtPayload extends JwtPayload {
  id: number;
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');

  let userId = 0;

  const cookieStore = cookies();
  const userData = cookieStore.get(USER_ID);
  if (userData) {
    const decoded = verify(userData.value, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    const payload = decoded as CustomJwtPayload;

    userId = payload.id;
    logger.info(decoded, 'Decoded ID:');
  }

  if (!authorizationCode) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }

  // Data to send in the POST request
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    code: authorizationCode,
    redirect_uri: redirectUri,
    grant_type: GRANT_TYPE,
    code_verifier: codeVerifier,
  };

  try {
    // Make the POST request to SoundCloud to exchange the code for an access token
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data as Record<string, string>),
    });

    if (!response.ok) {
      // Handle response errors (e.g., invalid code or network issues)
      const errorText = await response.text();
      return NextResponse.json({ error: `Error fetching token: ${errorText}` }, { status: response.status });
    }

    // Parse and return the token information
    const tokenInfo = (await response.json()) as TokenInfo;

    const inputData: Prisma.SoundCloudAccountCreateInput = {
      user_id: userId, // Ensure this matches the model
      access_token: tokenInfo.access_token,
      refresh_token: tokenInfo.refresh_token,
    };
    await prisma.soundCloudAccount.create({
      data: inputData,
    });

    return NextResponse.redirect(new URL('/home', request.url));
  } catch (error) {
    // Handle request errors
    return NextResponse.json({ error: `Request failed: ${(error as Error).message}` }, { status: 500 });
  }
}
