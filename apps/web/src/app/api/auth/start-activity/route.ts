'use server';

import { NextResponse } from 'next/server';
import { logger } from '@repo/logger';
import type { OptionsSchema } from '@/app/(unauthenticated)/home/type';
import { HTTP_STATUS } from '@/app/modules/constant';
import { getSoudCloudeTokenFromCookie, logAndRespondError } from '@/app/lib/common-functions';
import { fetchScrapUserData } from './action';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as OptionsSchema;
    const accessToken = await getSoudCloudeTokenFromCookie();
    if (!accessToken) {
      return logAndRespondError('Access token is missing or expired.', HTTP_STATUS.UNAUTHORIZED);
    }

    const result = await fetchScrapUserData(accessToken, (body.scrap_url = 'https://soundcloud.com/slam_djs123'));

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, `POST request error`);
    return NextResponse.json(error);
    // return logAndRespondError(`${error.err.message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
