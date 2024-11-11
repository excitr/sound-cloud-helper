'use server';

import { NextResponse } from 'next/server';
import { logger } from '@repo/logger';
import { HTTP_STATUS } from '@/app/modules/constant.ts';
import { getSoudCloudeTokenFromCookie, logAndRespondError } from '@/app/lib/common-functions';
import { followUser } from './actions';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { id: number; limit: number };

    const accessToken = await getSoudCloudeTokenFromCookie();

    if (!accessToken) {
      return logAndRespondError('Access token is missing or expired.', HTTP_STATUS.UNAUTHORIZED);
    }

    await followUser(accessToken, body.id);

    // if (!success) {
    //   return logAndRespondError('Failed to follow the user.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    // }

    return NextResponse.json({ success: true, id: body.id });
  } catch (error) {
    logger.error(error, `POST request error`);
    return logAndRespondError('Failed to fetch followers data.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
