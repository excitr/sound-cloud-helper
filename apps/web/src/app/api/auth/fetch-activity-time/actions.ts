'use server';

import { prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { getAccountIdFromCookie } from '@/app/lib/common-functions';
import { type LogActivitySchemaData } from '@/app/(unauthenticated)/home/type';

export interface APIResponse {
  success: boolean;
  id?: number;
  activityTime?: string;
  error?: string;
  data?: LogActivitySchemaData[];
}

interface Activity {
  accountId: string;
  startTime: Date;
  endTime: Date;
}

function calculateActivityTime(data: Activity[]): string {
  let totalSeconds = 0;

  // Step 1: Calculate total seconds for each activity
  data.forEach((activity) => {
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);

    // Ensure both dates are valid
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error(`Invalid date format in activity: ${JSON.stringify(activity)}`);
    }

    const diffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
    totalSeconds += diffInSeconds;
  });

  // Step 2: Convert total seconds to days, hours, and minutes
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Step 3: Format the result based on the time duration
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

export async function fetchUserActivity(): Promise<APIResponse> {
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
    const formattedResultData = resultData.map((item) => ({
      ...item,
      startTime: item.startTime.toISOString(),
      endTime: item.endTime.toISOString(),
    }));
    const time = calculateActivityTime(resultData);

    return {
      success: true,
      activityTime: time,
      data: formattedResultData,
    };
  } catch (error) {
    logger.error(error, 'Error in fetch-activity:');
    return {
      success: false,
    };
  }
}
