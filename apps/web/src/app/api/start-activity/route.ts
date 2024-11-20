'use server';

import { NextResponse } from 'next/server';
import { type LogActivity, prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { startOfDay, endOfDay } from 'date-fns';
import type { OptionsSchema, StartActivityResponseData } from '@/app/(authenticated)/home/type';
import { DAILY_MAX_FOLLOW_LIMIT } from '@/app/modules/constant';
import { getAccountIdFromCookie, getSoundCloudTokenFromCookie } from '@/app/lib/common-functions';
import { fetchScrapUserData } from './action';

export async function POST(request: Request): Promise<NextResponse<StartActivityResponseData>> {
  try {
    const body = (await request.json()) as OptionsSchema;
    const extendedBody = {
      ...body,
      endTime: new Date(),
    };

    const accessToken = await getSoundCloudTokenFromCookie();

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Not found access token',
        scrapUrlData: null,
        currentLogData: null,
        lastLogData: null,
        completedCountSum: 0,
      });
    }

    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return NextResponse.json({
        success: false,
        error: 'Not found account token',
        scrapUrlData: null,
        currentLogData: null,
        lastLogData: null,
        completedCountSum: 0,
      });
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

    const completedCountSum = todayLogActivities.reduce((sum, record) => sum + record.completedCount, 0);

    const lastLogData = todayLogActivities.length > 0 ? todayLogActivities[0] : null;

    if (completedCountSum >= DAILY_MAX_FOLLOW_LIMIT) {
      return NextResponse.json({
        success: true,
        scrapUrlData: null,
        currentLogData: null,
        lastLogData: null,
        completedCountSum,
        error: null,
      });
    }

    const data: Prisma.LogActivityCreateInput = {
      activityType: 'Follow',
      inputCount: Number(extendedBody.followCount),
      isStatus: 'Y',
      followUserId: '',
      accountId,
      startTime: new Date(),
      endTime: new Date(),
    };
    const currentLogData: LogActivity = await prisma.logActivity.create({
      data,
    });

    const result = await fetchScrapUserData(accessToken, extendedBody.scrapUrl);

    const formattedCurrentLogData = {
      ...currentLogData,
      startTime: currentLogData.startTime.toISOString(),
      endTime: currentLogData.endTime.toISOString() || null,
    };
    return NextResponse.json({
      success: true,
      scrapUrlData: result,
      currentLogData: formattedCurrentLogData,
      lastLogData: lastLogData
        ? {
            ...lastLogData,
            startTime: lastLogData.startTime.toISOString(),
            endTime: lastLogData.endTime.toISOString() || null,
          }
        : null,
      completedCountSum,
      error: null,
    });
  } catch (error) {
    logger.error(error, `Start Activity POST request error`);
    return NextResponse.json({
      success: false,
      error: 'Error on start activity',
      scrapUrlData: null,
      currentLogData: null,
      lastLogData: null,
      completedCountSum: 0,
    });
  }
}
