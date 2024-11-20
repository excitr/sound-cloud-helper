'use server';

import { z } from 'zod';
import { type LogActivity, prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { startOfDay, endOfDay } from 'date-fns';
import type { OptionsSchema, StartActivityResponseData } from '@/app/(authenticated)/home/type';
import { DAILY_MAX_FOLLOW_LIMIT, SOUNDCLOUD_RESOLVE_URL } from '@/app/modules/constant';
import { getAccountIdFromCookie, getSoundCloudTokenFromCookie } from '@/app/lib/common-functions';

const UserDataSchema = z.object({
  id: z.number(),
  followers_count: z.number(),
  followings_count: z.number(),
});

type UserData = z.infer<typeof UserDataSchema>;

export const fetchScrapUserData = async (accessToken: string, url: string): Promise<UserData> => {
  const response = await fetch(`${SOUNDCLOUD_RESOLVE_URL}?url=${url}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error fetching user data: ${errorText}`);
  }

  return UserDataSchema.parse(await response.json());
};

export const startActivity = async (body: OptionsSchema): Promise<StartActivityResponseData> => {
  try {
    const extendedBody = {
      ...body,
      endTime: new Date(),
    };

    const accessToken = await getSoundCloudTokenFromCookie();

    if (!accessToken) {
      return {
        success: false,
        error: 'Not found access token',
        scrapUrlData: null,
        currentLogData: null,
        lastLogData: null,
        completedCountSum: 0,
      };
    }

    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return {
        success: false,
        error: 'Not found account token',
        scrapUrlData: null,
        currentLogData: null,
        lastLogData: null,
        completedCountSum: 0,
      };
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
      return {
        success: true,
        scrapUrlData: null,
        currentLogData: null,
        lastLogData: null,
        completedCountSum,
        error: null,
      };
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
    return {
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
    };
  } catch (error) {
    logger.error(error, `Start Activity POST request error`);
    return {
      success: false,
      error: 'Error on start activity',
      scrapUrlData: null,
      currentLogData: null,
      lastLogData: null,
      completedCountSum: 0,
    };
  }
};
