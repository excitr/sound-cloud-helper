'use server';

import { NextResponse } from 'next/server';
import { prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { env } from '@/env.mjs';
import { GRANT_TYPE, TOKEN_URL } from '@/app/modules/constant.ts';

//const clientId = 'xd14qP9rMwtXGyn7He27BzDoJmwlzjV4';
// const clientSecret = 'NzyZ5dC0pYbPrrICsDehdByd2oVj7bms';
// const redirectUri = 'http://localhost:3000/api/auth/soundcloud/callback';
// const codeVerifier = '885cd22f15496061c731f6125f947ec00ed32ed12392ac6a0c99adbe';

const clientId = 'xd14qP9rMwtXGyn7He27BzDoJmwlzjV4';
const clientSecret = env.CLIENT_SECRET;
const redirectUri = env.REDIRECT_URL;
const codeVerifier = env.CODE_VERIFIER;

interface TokenInfo {
  access_token: string;
  expires_in: number;
  refresh_token: string; // Optional, if not always present
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');

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
  logger.info('data', data);
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

    const inputData: Prisma.SoundCloudTokenCreateInput = {
      accessToken: tokenInfo.access_token,
      expiresIn: tokenInfo.expires_in,
      refreshToken: tokenInfo.refresh_token || '',
    };

    await prisma.soundCloudToken.create({
      data: inputData,
    });

    return NextResponse.redirect(new URL('/home', request.url));
  } catch (error) {
    // Handle request errors
    return NextResponse.json({ error: `Request failed: ${(error as Error).message}` }, { status: 500 });
  }
}
