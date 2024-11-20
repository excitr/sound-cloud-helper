'use server';

import { logger } from '@repo/logger';
import { SOUNDCLOUD_FOLLOWINGS_URL } from '@/app/modules/constant';
import { FollowerSchema, type FollowResponseData } from '@/app/(authenticated)/home/type';
import { getSoundCloudTokenFromCookie } from '@/app/lib/common-functions';

export interface APIResponse {
  success: boolean;
  error?: string;
  data?: FollowResponseData;
}

export const followUserData = async (id: string): Promise<APIResponse> => {
  try {
    const accessToken = await getSoundCloudTokenFromCookie();
    if (!accessToken) {
      logger.error('No access token found.');
      return { success: false, error: 'No access token found' };
    }

    const followUserId = String(id);
    const url = `${SOUNDCLOUD_FOLLOWINGS_URL}/${followUserId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json; charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error when following user: ${response.statusText}`);
    }
    const parsedData = FollowerSchema.parse(await response.json());

    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error in followUserData: ${error.message}`);
      return { success: false, error: error.message || 'Unknown error' };
    }
    return { success: false, error: 'Unknown error from follow user' };
  }
};
