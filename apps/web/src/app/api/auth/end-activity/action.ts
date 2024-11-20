'use server';

import { prisma } from '@repo/database';
import { logger } from '@repo/logger';
import type { EndActivityAPIResponse, EndActivitySchema } from '@/app/(authenticated)/home/type';
import { getAccountIdFromCookie } from '@/app/lib/common-functions';

export async function endActivity(body: EndActivitySchema): Promise<EndActivityAPIResponse> {
  try {
    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return { success: false };
    }

    const updatedData = await prisma.logActivity.update({
      where: {
        id: body.id,
      },
      data: body,
    });

    return { success: true, id: updatedData.id };
  } catch (error) {
    logger.error(error, `End activity POST request error`);

    return { success: false, error: 'Error on end activity' };
  }
}
