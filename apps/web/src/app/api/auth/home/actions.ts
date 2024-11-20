'use server';

import { SOUNDCLOUD_ME_URL } from '@/app/modules/constant.ts';
import { getSoundCloudTokenFromCookie } from '@/app/lib/common-functions';
import { type HomeAPIResponseData, MeData, UserMetadata } from '@/app/(authenticated)/home/type';

export const fetchMeData = async (): Promise<HomeAPIResponseData> => {
  const accessToken = await getSoundCloudTokenFromCookie();

  if (!accessToken) {
    return { success: false };
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
  const rawData = MeData.parse(await response.json());

  const transformedData = UserMetadata.parse({
    id: rawData.id,
    userName: rawData.username, // Transforming to camelCase
    avatarUrl: rawData.avatar_url, // Transforming to camelCase
    followersCount: rawData.followers_count,
    followingsCount: rawData.followings_count,
  });

  return { success: true, data: transformedData };
};
