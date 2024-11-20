'use server';

import { logger } from '@repo/logger';
import { getSoudCloudeTokenFromCookie } from '@/app/lib/common-functions';
import { SOUNDCLOUD_USERS_FOLLOWERS_URL } from '@/app/modules/constant';
import { type FollowersResponseData, FollowersResponseSchema } from '@/app/(authenticated)/home/type';

export type APIFollowerResponse = APIErrorFollowerResponse | APISuccessFollowerResponse;
interface APIErrorFollowerResponse {
  success: false;
  error: string;
  currentCursor: null;
}
interface APISuccessFollowerResponse {
  success: true;
  currentCursor: string;
  data: FollowersResponseData;
}

export const fetchFollowerData = async (
  userId: string,
  limit: string,
  lastCursor: string,
): Promise<APIFollowerResponse> => {
  try {
    const accessToken = await getSoudCloudeTokenFromCookie();

    if (!accessToken) {
      return { success: false, error: 'Not found accesstoken', currentCursor: null };
    }

    let url = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${userId}/followers?limit=${limit}`;

    if (lastCursor) {
      url = `${SOUNDCLOUD_USERS_FOLLOWERS_URL}/${userId}/followers?page_size=${limit}&cursor=${lastCursor}`;
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
    // const regex = /(?:[?&]cursor=(?<cursor>\d+))/;
    const regex = /[?&]cursor=(?<cursor>\d+)/;
    const match = regex.exec(parsedData.next_href ?? '');

    const cursor = match ? match[1] : '';
    return { success: true, data: parsedData, currentCursor: String(cursor) };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error in followUserData: ${error.message}`);
      return { success: false, error: error.message || 'Unknown error', currentCursor: null };
    }
    return { success: false, error: 'Unknown error from follow user', currentCursor: null };
  }
};
