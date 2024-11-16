'use server';

import { logger } from '@repo/logger';
import { type FollowersResponseData, FollowersResponseSchema } from '@/app/(unauthenticated)/home/type';
import { getSoudCloudeTokenFromCookie } from '@/app/lib/common-functions';
import { SOUNDCLOUD_USERS_FOLLOWERS_URL } from '@/app/modules/constant';

export interface APIFollowerResponse {
  success: boolean;
  error?: string;
  currectCursor: string;
  data?: FollowersResponseData;
}
export const fetchFollowerData = async (
  userId: string,
  limit: string,
  lastcursor: string,
): Promise<APIFollowerResponse> => {
  try {
    const accessToken = await getSoudCloudeTokenFromCookie();

    if (!accessToken) {
      return { success: false, error: 'Not found accesstoken', currectCursor: '' };
    }

    let url = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${userId}/followers?limit=${limit}`;

    if (lastcursor) {
      url = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${userId}/followers?page_size=${limit}&cursor=${lastcursor}`;
    }
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

    const parsedData = FollowersResponseSchema.parse(await response.json());
    const regex = /(?:[?&]cursor=(?<cursor>\d+))/;
    const match = regex.exec(parsedData.next_href ?? '');

    const cursor = match ? match[1] : '';
    return { success: true, data: parsedData, currectCursor: String(cursor) };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error in followUserData: ${error.message}`);
      return { success: false, error: error.message || 'Unknown error', currectCursor: '' };
    }
    return { success: false, error: 'Unknown error from follow user', currectCursor: '' };
  }
};
