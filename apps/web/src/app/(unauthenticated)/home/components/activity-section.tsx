'use client';

import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { logger } from '@repo/logger';
import { rem } from '@/theme';
import { type APIFollowerResponse, fetchFollowerData } from '@/app/api/auth/fetch-followers/actions';
import { type APIResponse, followUserData } from '@/app/api/auth/follow/actions';
import { initiallyOptions, useHomePageContext } from '../context';
import { LogActivitySchema, ScrapUserErrorSchema, StartActivitySchema, VerifyTokenResponceSchema } from '../type';
import { type VerifyTokenResponceData } from '../type';

export const verifySoundCouldToken = async (): Promise<VerifyTokenResponceData> => {
  const response = await fetch('/api/auth/generate-soundcloud-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Oops! Something went wrong while connecting to the soundcloud service. Please try again later.');
  }

  const result = VerifyTokenResponceSchema.parse(await response.json());

  if (!result.success) {
    toast.error('');
  }
  return result;
};

export default function ActivitySection(): React.JSX.Element {
  const { activity, setActivity, options, setOptions, fetchProfileData } = useHomePageContext();

  const handleActivity = async (): Promise<void> => {
    if (options.scrap_url && options.follow_count > 0) {
      setActivity(true);

      const tokenData: VerifyTokenResponceData | undefined = await verifySoundCouldToken();

      if (tokenData.success) {
        await runActivity();
      }
    } else {
      toast.error('Plz login with soundCloud');
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
    nextHref: string | null;
    success: boolean;
    currectCursor: string;
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
          nextHref: null,
          success: false,
          currectCursor: '',
          currentFollowedId: '',
        };
      }
      const followers = followerList.data;
      const successFollowIds: number[] = [];
      let updatedFirstId = firstId;
      if (followers && Boolean(followers.collection.length)) {
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
          nextHref: followers.next_href,
          currectCursor: followerList.currectCursor,
          success: true,
          currentFollowedId: updatedFirstId ?? null,
        };
      }

      return { successFollowCount: 0, nextHref: null, success: false, currectCursor: '', currentFollowedId: '' };
    } catch (error) {
      logger.error('Error fetching followers:', error);
      return { successFollowCount: 0, nextHref: null, success: false, currectCursor: '', currentFollowedId: '' };
    }
  };

  const recursiveFetchFollowersData = async (
    scrapUrlId: string,
    targetFollowCount: number,
    currentCount: number,
    lastFollowUserId: number | null | undefined,
    cursor: string | null | undefined,
  ): Promise<{ totalCount: number; currectCursor: string; currentFollowedId: string }> => {
    const firstId = '';
    const { successFollowCount, success, currectCursor, currentFollowedId } = await fetchFollowersList(
      String(scrapUrlId),
      Number(targetFollowCount) - Number(currentCount),
      lastFollowUserId,
      cursor,
      firstId,
    );

    const totalCount = Number(currentCount) + Number(successFollowCount);

    if (Number(totalCount) >= Number(targetFollowCount)) {
      return { totalCount, currectCursor, currentFollowedId };
    }

    if (currectCursor && success && Number(totalCount) !== Number(targetFollowCount)) {
      return recursiveFetchFollowersData(
        String(scrapUrlId),
        Number(targetFollowCount),
        Number(totalCount),
        lastFollowUserId,
        currectCursor,
      );
    }

    return { totalCount, currectCursor, currentFollowedId };
  };
  const runActivity = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/start-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        setActivity(false);
        const errorData = ScrapUserErrorSchema.safeParse(await response.json());
        if (errorData.success) {
          toast.error(errorData.data.error);
        }
        return;
      }

      const result = StartActivitySchema.parse(await response.json());

      if (!result.currentLogData && !result.scrapUrlData) {
        toast.error(`You reached your today limit ${String(result.completedCountSum)}`);
        setActivity(false);
        setOptions(initiallyOptions);
        return;
      }

      const { totalCount, currectCursor, currentFollowedId } = await recursiveFetchFollowersData(
        String(result.scrapUrlData?.id),
        options.follow_count,
        0,
        Number(result.lastLogData?.lastFollowUserId) || null,
        result.lastLogData?.cursor,
      );

      const endActivityData = {
        completedCount: Number(totalCount),
        isStatus: 'N',
        isSuccess: Number(totalCount) === Number(options.follow_count) ? 'Success' : 'UnSuccess',
        nextHref: '',
        followUserId: String(result.scrapUrlData?.id),
        lastFollowUserId: String(currentFollowedId),
        id: result.currentLogData?.id,
        cursor: String(currectCursor),
      };
      const endActivityResponse = await fetch('/api/auth/end-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endActivityData),
      });

      const endActivityResponce = LogActivitySchema.parse(await endActivityResponse.json());

      if (endActivityResponce.id) {
        await fetchProfileData();
        toast.success(`Followed ${String(totalCount)} users`);
      }

      setActivity(false);
      setOptions(initiallyOptions);
    } catch (error) {
      setActivity(false);
      setOptions(initiallyOptions);
      logger.error('Fetch run activity error:', error instanceof Error ? error.message : error);
    }
  };

  const cancelActivity = (): void => {
    setOptions(initiallyOptions);
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
              width={60} // Set width and height
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
            142 day(s) 13h 33 m
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
