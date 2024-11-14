'use server';

import { NextResponse } from 'next/server';
import { logger } from '@repo/logger';
import { HTTP_STATUS } from '@/app/modules/constant.ts';
import { getSoudCloudeTokenFromCookie, logAndRespondError } from '@/app/lib/common-functions';
import { followUser } from './actions';

export async function POST(request: Request): Promise<NextResponse | null> {
  try {
    const body = (await request.json()) as { id: number };

    const accessToken = await getSoudCloudeTokenFromCookie();

    if (!accessToken) {
      return logAndRespondError('Access token is missing or expired.', HTTP_STATUS.UNAUTHORIZED);
    }

    const response = await followUser(accessToken, body.id);

    return NextResponse.json(response);
  } catch (error) {
    logger.error(error, `POST request follow api error`);
    return null;
  }
}
