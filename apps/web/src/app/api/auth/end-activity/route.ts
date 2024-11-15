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

    // Ensure `body` has only the allowed fields for Prisma update
    const updateData = {
      completed_count: body.completed_count,
      end_time: new Date(body.end_time), // Ensure this is a valid Date object
      isStatus: body.isStatus,
      isSuccess: body.isSuccess,
      nextHref: body.nextHref,
    };

    const updatedData = await prisma.logActivity.update({
      where: {
        id: body.id,
      },
      data: updateData, // Use validated and type-safe data
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    logger.error(error, `End activity POST request error`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
