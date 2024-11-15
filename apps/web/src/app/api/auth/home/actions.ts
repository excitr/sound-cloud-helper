'use server';

import { z } from 'zod';
import { SOUNDCLOUD_ME_URL } from '@/app/modules/constant.ts';
import { getSoudCloudeTokenFromCookie } from '@/app/lib/common-functions';

const MeDataSchema = z.object({
  id: z.number(),
  username: z.string(),
  avatar_url: z.string(),
  followers_count: z.number(),
  followings_count: z.number(),
});

type MeData = z.infer<typeof MeDataSchema>;

export const fetchMeData = async (): Promise<MeData | null> => {
  const accessToken = await getSoudCloudeTokenFromCookie();

  if (!accessToken) {
    return null;
  }
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
