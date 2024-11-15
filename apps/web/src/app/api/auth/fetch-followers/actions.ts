'use server';
import { type FollowersResponseData, FollowersResponseSchema } from '@/app/(unauthenticated)/home/type';
import { getSoudCloudeTokenFromCookie } from '@/app/lib/common-functions';
import { SOUNDCLOUD_USERS_FOLLOWERS_URL } from '@/app/modules/constant';

export const fetchFollowerData = async (
  url: string,
  userId: string,
  limit: string,
): Promise<FollowersResponseData | null> => {
  const accessToken = await getSoudCloudeTokenFromCookie();

  if (!accessToken) {
    return null;
  }

  let finalUrl = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${userId}/followers?limit=${limit}`;

  if (url) {
    const regex = /(?:[?&]cursor=(?<cursor>\d+))/;
    const match = regex.exec(url);

    const cursor = match ? match[1] : '';
    finalUrl = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${userId}/followers?page_size=${limit}&cursor=${cursor}`;
  }
  const response = await fetch(finalUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return FollowersResponseSchema.parse(await response.json());
};
