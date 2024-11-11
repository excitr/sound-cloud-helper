'use server';

import { z } from 'zod';
import { SOUNDCLOUD_RESOLVE_URL } from '@/app/modules/constant';

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
    throw new Error(`Error fetching token: ${errorText}`);
  }

  return UserDataSchema.parse(await response.json());
};
