'use server';

import { NextResponse } from 'next/server';
import { type LogActivity, prisma, type Prisma } from '@repo/database';
import { logger } from '@repo/logger';
import type { EndActivitySchema } from '@/app/(unauthenticated)/home/type';
import { HTTP_STATUS } from '@/app/modules/constant';
import { getAccountIdFromCookie, logAndRespondError } from '@/app/lib/common-functions';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as EndActivitySchema;

    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return logAndRespondError('Account id is missing', HTTP_STATUS.UNAUTHORIZED);
    }

    const updatedData = await prisma.logActivity.update({
      where: {
        id: body.id,
      },
      data: body,
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    logger.error(error, `End activity POST request error`);
    return NextResponse.json(error);
  }
}
