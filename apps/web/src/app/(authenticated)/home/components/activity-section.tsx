'use client';

import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { logger } from '@repo/logger';
import { rem } from '@/theme';
import { type APIFollowerResponse, fetchFollowerData } from '@/app/api/auth/fetch-followers/actions';
import { type APIResponse, followUserData } from '@/app/api/auth/follow/actions';
import { DAILY_MAX_FOLLOW_LIMIT, SOUNDCLOUD_FOLLOW_LIMIT } from '@/app/modules/constant';
import { type APITokenResponse, generateSoundCloudToken } from '@/app/api/auth/generate-soundcloud-token/actions';
import { startActivity } from '@/app/api/start-activity/action';
import { initialOptions, useHomePageContext } from '../context';
import { EndActivityResponse, StartActivitySchema } from '../type';

export const verifySoundCouldToken = async (): Promise<APITokenResponse> => {
  const response: APITokenResponse = await generateSoundCloudToken();
  if (!response.success) {
    throw new Error('Oops! Something went wrong while connecting to the soundcloud service. Please try again later.');
  }
  return response;
};

export default function ActivitySection(): React.JSX.Element {
  const { activity, setActivity, options, setOptions, fetchProfileData, profileData, activityTime } =
    useHomePageContext();

  const handleActivity = async (): Promise<void> => {
    await fetchProfileData();

    const followLimit = Number(options.followCount) + Number(profileData.followings_count);

    if (followLimit >= SOUNDCLOUD_FOLLOW_LIMIT) {
      toast.error('Your Following limit is exceed');
      return;
    }

    if (options.scrapUrl && options.followCount > 0) {
      setActivity(true);

      const tokenData: APITokenResponse | undefined = await verifySoundCouldToken();

      if (tokenData.success) {
        await runActivity();
      }
    } else {
      toast.error('Please correct your options.');
    }
  };

  const fetchFollowersList = async (
    scrapUrlId: string,
    followCount: number,
    lastFollowUserId: number | null | undefined,
    lastCursor: string | null | undefined,
    firstId: string | null | undefined,
  ): Promise<{
    successFollowCount: number;
    success: boolean;
    currentCursor: string;
    currentFollowedId: string | null;
  }> => {
    try {
      const followerList: APIFollowerResponse = await fetchFollowerData(
        scrapUrlId,
        String(followCount),
        String(lastCursor),
      );

      if (!followerList.success) {
        return {
          successFollowCount: 0,
          success: false,
          currentCursor: '',
          currentFollowedId: '',
        };
      }
      const followers = followerList.data;
      const successFollowIds: number[] = [];
      let updatedFirstId = firstId;
      if (followers.collection.length) {
        for (const follower of followers.collection) {
          if (!updatedFirstId) {
            if (follower.id) {
              updatedFirstId = String(follower.id);
            }
          }

          if (lastFollowUserId === follower.id && followCount !== Number(successFollowIds.length)) {
            const remainCount = followCount - successFollowIds.length;
            return await fetchFollowersList(scrapUrlId, remainCount, lastFollowUserId, lastCursor, updatedFirstId);
          }
          const followResponse: APIResponse = await followUserData(String(follower.id));

          if (followResponse.success) {
            if (followResponse.data) {
              successFollowIds.push(followResponse.data.id);
            }
          }
          if (!followResponse.success) {
            break;
          }
        }
        return {
          successFollowCount: Number(successFollowIds.length),
          currentCursor: followerList.currentCursor,
          success: true,
          currentFollowedId: updatedFirstId ?? null,
        };
      }

      return { successFollowCount: 0, success: false, currentCursor: '', currentFollowedId: '' };
    } catch (error) {
      logger.error('Error fetching followers:', error);
      return { successFollowCount: 0, success: false, currentCursor: '', currentFollowedId: '' };
    }
  };

  const recursiveFetchFollowersData = async (
    scrapUrlId: string,
    targetFollowCount: number,
    currentCount: number,
    lastFollowUserId: number | null | undefined,
    cursor: string | null | undefined,
  ): Promise<{ totalCount: number; currentCursor: string; currentFollowedId: string | null }> => {
    const firstId = null;
    const { successFollowCount, success, currentCursor, currentFollowedId } = await fetchFollowersList(
      String(scrapUrlId),
      Number(targetFollowCount) - Number(currentCount),
      lastFollowUserId,
      cursor,
      firstId,
    );
    const totalCount = Number(currentCount) + Number(successFollowCount);

    if (Number(totalCount) >= Number(targetFollowCount)) {
      return { totalCount, currentCursor, currentFollowedId };
    }

    if (currentCursor && success && Number(totalCount) !== Number(targetFollowCount)) {
      return recursiveFetchFollowersData(
        String(scrapUrlId),
        Number(targetFollowCount),
        Number(totalCount),
        lastFollowUserId,
        currentCursor,
      );
    }

    return { totalCount, currentCursor, currentFollowedId };
  };
  const runActivity = async (): Promise<void> => {
    try {
      const response = await startActivity(options);

      if (!response.success) {
        setActivity(false);
        return;
      }
      const result = StartActivitySchema.parse(response);
      if (Number(result.completedCountSum) === DAILY_MAX_FOLLOW_LIMIT) {
        toast.error(`You reached your today limit ${String(result.completedCountSum)}`);
        setActivity(false);
        setOptions(initialOptions);
        return;
      }
      if (!result.success || !result.scrapUrlData || !result.currentLogData) {
        setActivity(false);
        setOptions(initialOptions);
        toast.error(`Not found scrapped url data`);

        return;
      }

      const { totalCount, currentCursor, currentFollowedId } = await recursiveFetchFollowersData(
        String(result.scrapUrlData.id),
        options.followCount,
        0,
        Number(result.lastLogData?.lastFollowUserId) || null,
        result.lastLogData?.cursor,
      );

      const endActivityData = {
        completedCount: totalCount,
        isStatus: 'N',
        isSuccess: totalCount === options.followCount ? 'Success' : 'Failure',
        followUserId: String(result.scrapUrlData.id),
        lastFollowUserId: String(currentFollowedId),
        id: result.currentLogData.id,
        cursor: String(currentCursor),
      };
      const endActivityResponse = await fetch('/api/auth/end-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endActivityData),
      });

      const { success } = EndActivityResponse.parse(await endActivityResponse.json());

      if (success) {
        await fetchProfileData();
        toast.success(`Followed ${String(totalCount)} users`);
      }

      setActivity(false);
      setOptions(initialOptions);
    } catch (error) {
      setActivity(false);
      setOptions(initialOptions);
      logger.error('Fetch run activity error:', error instanceof Error ? error.message : error);
    }
  };

  const cancelActivity = (): void => {
    setOptions(initialOptions);
    setActivity(false);
  };
  const startActivityClick = (): void => {
    void handleActivity();
  };

  return (
    <Box my={6} display="flex" flexDirection="column" alignItems="center" textAlign="center">
      <Box mb={6} gap={5} display="flex">
        <Typography mt={1} fontWeight={700} ml={6} color="#0B0C1B)" fontSize={rem(28.8)}>
          Activity
        </Typography>

        {!activity && (
          <Button
            sx={{
              color: '#444444',
              fontWeight: '500',
              ml: 8,
              fontSize: rem(25.6),
              textTransform: 'none',
            }}
            onClick={startActivityClick}
          >
            <Image
              src="/main-page/Play-icon.svg"
              alt="SoundCloud"
              width={60}
              height={60}
              unoptimized
              style={{ border: '1px solid red', borderRadius: '100%', marginRight: '8px' }}
            />
            Start Activity
          </Button>
        )}

        {Boolean(activity) && (
          <Button
            sx={{
              color: '#444444',
              fontWeight: '500',
              fontSize: rem(25.6),
              textTransform: 'none',
              visibility: 'visible',
            }}
            disabled
            onClick={cancelActivity}
          >
            <Image
              src="/main-page/Pause-icon.svg"
              alt="SoundCloud"
              width={60}
              height={60}
              unoptimized
              style={{ border: '1px solid red', borderRadius: '100%', marginRight: '8px' }}
            />
            Cancel
          </Button>
        )}
      </Box>
      <Box display="flex" gap={6} ml={28}>
        <Box
          py={4}
          pr={4}
          pl={2}
          textAlign="left"
          borderRadius={4}
          sx={{
            backgroundColor: '#F5F5F5',
          }}
        >
          <Typography fontWeight={500} color="#777" fontSize={rem(25.6)} variant="subtitle1">
            Time
          </Typography>
          <Typography fontWeight={500} color="#777" mt={1} fontSize={rem(25.6)} variant="body2">
            {activityTime}
          </Typography>
        </Box>
        <Box
          py={4}
          pr={14}
          pl={2}
          borderRadius={4}
          textAlign="left"
          sx={{
            backgroundColor: '#F5F5F5',
          }}
        >
          <Typography fontWeight={500} color="#777" fontSize={rem(25.6)} variant="subtitle1">
            Followings
          </Typography>
          <Typography fontWeight={500} color="#777" fontSize={rem(25.6)} mt={1} variant="body2">
            0
          </Typography>
        </Box>
        <Box
          py={4}
          pr={12}
          pl={2}
          borderRadius={4}
          textAlign="left"
          sx={{
            backgroundColor: '#F5F5F5',
          }}
        >
          <Typography fontWeight={500} color="#777" fontSize={rem(25.6)} variant="subtitle1">
            Unfollowings
          </Typography>
          <Typography fontWeight={500} color="#777" fontSize={rem(25.6)} mt={1} variant="body2">
            0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
