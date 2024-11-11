import { z } from 'zod';
import { SOUNDCLOUD_USERS_FOLLOWERS_URL } from '@/app/modules/constant';

const FollowerSchema = z.object({
  id: z.number(),
  username: z.string(),
});

const FollowersResponseSchema = z.array(FollowerSchema);

type FollowersResponseData = z.infer<typeof FollowersResponseSchema>;

export const fetchFollowerData = async (
  accessToken: string,
  id: number,
  limit: number,
): Promise<FollowersResponseData> => {
  const url = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${String(id)}/followers?limit=${String(limit)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  //const jsonResponse = await response.json();
  //logger.info(`Raw Followers Response: ${JSON.stringify(jsonResponse)}`);

  return FollowersResponseSchema.parse(response.json());
};
