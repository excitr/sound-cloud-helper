'use server';

import { NextResponse } from 'next/server';
import { type LogActivity, prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { startOfDay, endOfDay } from 'date-fns';
import type { OptionsSchema } from '@/app/(unauthenticated)/home/type';
import { DAILY_MAX_FOLLOW_LIMIT } from '@/app/modules/constant';
import { getAccountIdFromCookie, getSoudCloudeTokenFromCookie } from '@/app/lib/common-functions';
import { fetchScrapUserData } from './action';

export async function POST(request: Request): Promise<NextResponse | null> {
  try {
    const body = (await request.json()) as OptionsSchema;

    const accessToken = await getSoudCloudeTokenFromCookie();

    if (!accessToken) {
      return null;
    }

    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return null;
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

    if (completedCountSum >= DAILY_MAX_FOLLOW_LIMIT) {
      return NextResponse.json({ scrapUrlData: null, currentLogData: null, lastLogData, completedCountSum });
    }

    const data: Prisma.LogActivityCreateInput = {
      activityType: 'Follow',
      inputCount: Number(body.follow_count),
      isStatus: 'Y',
      followUserId: '',
      accountId,
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
