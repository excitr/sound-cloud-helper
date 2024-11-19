'use server';

import { SOUNDCLOUD_ME_URL } from '@/app/modules/constant.ts';
import { getSoudCloudeTokenFromCookie } from '@/app/lib/common-functions';
import { type HomeAPIResponseData, MeData } from '@/app/(unauthenticated)/home/type';

export const fetchMeData = async (): Promise<HomeAPIResponseData> => {
  const accessToken = await getSoudCloudeTokenFromCookie();

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

  return { success: true, data: MeData.parse(await response.json()) };
};
