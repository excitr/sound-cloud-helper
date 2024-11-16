'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { logger } from '@repo/logger';
import type { EndActivitySchema } from '@/app/(unauthenticated)/home/type';
import { getAccountIdFromCookie } from '@/app/lib/common-functions';

export async function POST(request: Request): Promise<NextResponse | null> {
  try {
    const body = (await request.json()) as EndActivitySchema;

    const accountId = await getAccountIdFromCookie();

    if (!accountId) {
      return null;
    }
    body.endTime = new Date();

    const updatedData = await prisma.logActivity.update({
      where: {
        id: body.id,
      },
      data: body,
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    logger.error(error, `End activity POST request error`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
