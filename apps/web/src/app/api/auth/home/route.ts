'use server';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@repo/logger';
import { HTTP_STATUS, SOUNDCLOUD_ME_URL } from '@/app/modules/constant.ts';
import { getSoudCloudeTokenFromCookie, logAndRespondError } from '@/app/lib/common-functions';

const MeDataSchema = z.object({
  id: z.number(),
  username: z.string(),
  avatar_url: z.string(),
  followers_count: z.number(),
  followings_count: z.number(),
});

type MeData = z.infer<typeof MeDataSchema>;

const fetchMeData = async (accessToken: string): Promise<MeData> => {
  const response = await fetch(SOUNDCLOUD_ME_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return MeDataSchema.parse(await response.json());
};

export async function GET(): Promise<NextResponse> {
  try {
    const accessToken = await getSoudCloudeTokenFromCookie();

    if (!accessToken) {
      return logAndRespondError('Access token is missing or expired.', HTTP_STATUS.UNAUTHORIZED);
    }

    const meData: MeData = await fetchMeData(accessToken);

    // Optionally, store the `meData` in your database or log it.

    return NextResponse.json(meData);
  } catch (error) {
    logger.error(error, 'Error: FetchMeData');
    return logAndRespondError('Failed to fetch user data.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
