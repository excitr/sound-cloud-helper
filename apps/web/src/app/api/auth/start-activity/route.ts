'use server';

import { NextResponse } from 'next/server';
import { type LogActivity, prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { startOfDay, endOfDay } from 'date-fns';
import type { OptionsSchema } from '@/app/(unauthenticated)/home/type';
import { HTTP_STATUS, MAX_FOLLOW } from '@/app/modules/constant';
import { getAccountIdFromCookie, getSoudCloudeTokenFromCookie, logAndRespondError } from '@/app/lib/common-functions';
import { fetchScrapUserData } from './action';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as OptionsSchema;

    const accessToken = await getSoudCloudeTokenFromCookie();
    if (!accessToken) {
      return logAndRespondError('Access token is missing or expired.', HTTP_STATUS.UNAUTHORIZED);
    }

    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return logAndRespondError('Account id is missing', HTTP_STATUS.UNAUTHORIZED);
    }

    const today = new Date();
    const todayLogActivities = await prisma.logActivity.findMany({
      where: {
        activityType: 'Follow',
        accountId,
        startTime: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    const completedCountSum = todayLogActivities.reduce((sum, record) => sum + (record.completedCount || 0), 0);

    const lastLogData = todayLogActivities.length > 0 ? todayLogActivities[0] : null;

    if (completedCountSum >= MAX_FOLLOW) {
      return NextResponse.json({ scrapUrlData: null, currentLogData: null, lastLogData, completedCountSum });
    }

    const data: Prisma.LogActivityCreateInput = {
      activityType: 'Follow',
      inputCount: Number(body.follow_count),
      isStatus: 'Y',
      accountId: Number(accountId),
    };
    const currentLogData: LogActivity = await prisma.logActivity.create({
      data,
    });

    const result = await fetchScrapUserData(accessToken, body.scrap_url);

    return NextResponse.json({ scrapUrlData: result, currentLogData, lastLogData, completedCountSum });
  } catch (error) {
    logger.error(error, `Start Activity POST request error`);
    return NextResponse.json(error);
  }
}
