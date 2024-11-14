'use server';

import { NextResponse } from 'next/server';
import { logger } from '@repo/logger';
import { HTTP_STATUS, SOUNDCLOUD_USERS_FOLLOWERS_URL } from '@/app/modules/constant';
import { getSoudCloudeTokenFromCookie, logAndRespondError } from '@/app/lib/common-functions';
import { fetchFollowerData } from './actions';
import { string } from 'zod';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { id: number; limit: number; url: string };

    const accessToken = await getSoudCloudeTokenFromCookie();

    if (!accessToken) {
      return logAndRespondError('Access token is missing or expired.', HTTP_STATUS.UNAUTHORIZED);
    }

    let finalUrl = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${String(body.id)}/followers?limit=${String(body.limit)}`;

    if (body.url) {
      const regex = /(?:[?&]cursor=(?<cursor>\d+))/;
      const match = regex.exec(body.url);

      const cursor = match ? match[1] : '';
      finalUrl = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${String(body.id)}/followers?page_size=${String(body.limit)}&cursor=${cursor}`;
    }

    const followersData = await fetchFollowerData(accessToken, finalUrl);

    return NextResponse.json(followersData);
  } catch (error) {
    logger.error(error, 'Failed to fetch followers data.');
    return logAndRespondError('Failed to fetch followers data.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
