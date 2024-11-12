'use server';
import { z } from 'zod';
import { SOUNDCLOUD_ME_URL } from '@/app/modules/constant';

const FollowerResponseSchema = z.array(
  z.object({
    id: z.string(),
  }),
);

type FollowResponseInfo = z.infer<typeof FollowerResponseSchema>;

export const followUser = async (accessToken: string, id: number): Promise<FollowResponseInfo> => {
  const url = `${SOUNDCLOUD_ME_URL}/followings/${String(id)}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  // Parse and return the response as an array of objects
  return FollowerResponseSchema.parse(await response.json());
};
