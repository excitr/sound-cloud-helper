'use server';

import { prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { getAccountIdFromCookie } from '@/app/lib/common-functions';
import { type ActivityAPIResponse } from '@/app/(authenticated)/home/type';

interface Activity {
  accountId: string;
  startTime: Date;
  endTime: Date;
}

function calculateActivityTime(data: Activity[]): string {
  let totalSeconds = 0;

  data.forEach((activity) => {
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error(`Invalid date format in activity: ${JSON.stringify(activity)}`);
    }

    const diffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
    totalSeconds += diffInSeconds;
  });

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let result = '';
  if (days > 0) {
    result += `${String(days)} day(s) `;
  }
  if (hours > 0 || days > 0) {
    result += `${String(hours)}h `;
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    result += `${String(minutes)}m `;
  }
  if (seconds > 0 && days === 0 && hours === 0 && minutes === 0) {
    result += `${String(seconds)}s`;
  }

  return result.trim();
}

export async function fetchUserActivity(): Promise<ActivityAPIResponse> {
  try {
    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return {
        success: false,
        error: 'Account Id not found',
      };
    }

    const resultData = await prisma.logActivity.findMany({
      where: { accountId },
      orderBy: {
        startTime: 'desc',
      },
      take: 30,
    });

    const time = calculateActivityTime(resultData);

    return {
      success: true,
      activityTime: time,
      data: resultData,
    };
  } catch (error) {
    logger.error(error, 'Error in fetch-activity:');
    return {
      success: false,
    };
  }
}
