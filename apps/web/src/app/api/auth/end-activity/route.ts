'use server';

import { prisma } from '@repo/database';
import { logger } from '@repo/logger';
import { NextResponse } from 'next/server';
import type { EndActivitySchema } from '@/app/(authenticated)/home/type';
import { getAccountIdFromCookie } from '@/app/lib/common-functions';

export interface EndActiviAPIResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<EndActiviAPIResponse>> {
  try {
    const body = (await request.json()) as EndActivitySchema;

    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return NextResponse.json({ success: false });
    }
    body.endTime = new Date();

    const updatedData = await prisma.logActivity.update({
      where: {
        id: body.id,
      },
      data: body,
    });

    return NextResponse.json({ success: true, id: updatedData.id, error: '' });
  } catch (error) {
    logger.error(error, `End activity POST request error`);

    return NextResponse.json({ success: false, error: 'Error on end activity' });
  }
}
