'use client';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { logger } from '@repo/logger';
import { rem } from '@/theme';
import { initiallyOptions, useHomePageContext } from '../context';
import { LogActivitySchema } from '../type';

const ScrapUrlDataSchema = z.object({
  id: z.number(),
  followers_count: z.number(),
  followings_count: z.number(),
});

const LogDataSchema = z.object({
  id: z.string(),
  activityType: z.enum(['Follow', 'Like', 'Comment']), // Adjust if needed
  inputCount: z.number(),
  accountId: z.number(),
  completedCount: z.number(),
  isSuccess: z.union([z.boolean(), z.enum(['Success', 'UnSuccess']).nullable()]),
  isStatus: z.enum(['Y', 'N']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

const DataSchema = z.object({
  scrapUrlData: ScrapUrlDataSchema.nullable(),
  currentLogData: LogDataSchema.nullable(),
  lastLogData: LogDataSchema.nullable(),
  completedCountSum: z.number(),
});

const ScrapUserErrorSchema = z.object({
  error: z.string(),
});

const ProductSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
});

const SubscriptionSchema = z.object({
  product: ProductSchema,
});

const FollowerSchema = z.object({
  avatar_url: z.string().url().nullable(),
  id: z.number(),
  kind: z.string().nullable(),
  permalink_url: z.string().url().nullable(),
  uri: z.string().url().nullable(),
  username: z.string().nullable(),
  permalink: z.string().nullable(),
  created_at: z.string().nullable(),
  last_modified: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  full_name: z.string().nullable(),
  city: z.string().nullable(),
  description: z.string().nullable(),
  country: z.string().nullable(),
  track_count: z.number().nullable(),
  public_favorites_count: z.number().nullable(),
  reposts_count: z.number().nullable(),
  followers_count: z.number().nullable(),
  followings_count: z.number().nullable(),
  plan: z.string().nullable(),
  myspace_name: z.string().nullable(),
  discogs_name: z.string().nullable(),
  website_title: z.string().nullable(),
  website: z.string().nullable(),
  comments_count: z.number().nullable(),
  online: z.boolean().nullable(),
  likes_count: z.number().nullable(),
  playlist_count: z.number().optional().nullable(), // Make this optional
  subscriptions: z.array(SubscriptionSchema),
});

const FollowersResponseSchema = z.object({
  collection: z.array(FollowerSchema),
  next_href: z.string().url().nullable(),
});

type FollowersResponseData = z.infer<typeof FollowersResponseSchema>;

type FollowUserResponseData = z.infer<typeof FollowerSchema>;

export default function ActivitySection(): React.JSX.Element {
  const { activity, setActivity, options, setOptions } = useHomePageContext();

  const verifySoundCouldToken = async () => {
    const response = await fetch('/api/auth/generate-soundcloud-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  };
  const handleActivity = async (): Promise<void> => {
    if (options.scrap_url && options.follow_count > 0) {
      setActivity(true);
      await verifySoundCouldToken();

      await runActivity();
    } else {
      toast.error('Please correct your options.');
    }
  };

  const fetchFollowersData = async (
    scrapUrlId: number,
    followCount: number,
    nextHref: string,
  ): Promise<{ successFollowCount: number; nextHref: string | null }> => {
    try {
      const followers = await fetchFollowers(scrapUrlId, followCount, nextHref);
      const successFollowIds: number[] = [];

      if (followers && Boolean(followers.collection.length)) {
        for (const follower of followers.collection) {
          const followResponse = await followUser(Number(follower.id));
          if (followResponse) {
            successFollowIds.push(followResponse?.id);
          }
        }
        return { successFollowCount: Number(successFollowIds.length), nextHref: followers.next_href }; // Return the length of successful follows
      }

      return { successFollowCount: 0, nextHref: null };
    } catch (error) {
      logger.error('Error fetching followers:', error);
      return { successFollowCount: 0, nextHref: null };
    }
  };

  const recursiveFetchFollowersData = async (
    scrapUrlId: number,
    targetFollowCount: number,
    currentCount: number,
    nextHref: string | null = null,
  ): Promise<number> => {
    const { successFollowCount, nextHref: newNextHref } = await fetchFollowersData(
      scrapUrlId,
      Number(targetFollowCount) - Number(currentCount),
      nextHref ? nextHref : '',
    );

    const totalCount = Number(currentCount) + Number(successFollowCount);

    if (Number(totalCount) >= Number(targetFollowCount)) {
      return totalCount;
    }

    if (newNextHref) {
      return recursiveFetchFollowersData(scrapUrlId, Number(targetFollowCount), Number(totalCount), newNextHref);
    }

    return Number(totalCount);
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

      const result = DataSchema.parse(await response.json());

      if (!result.currentLogData && !result.scrapUrlData) {
        toast.error(`You reached your today limit ${String(result.completedCountSum)}`);
        setActivity(false);
        setOptions(initiallyOptions);
        return;
      }

      const totalSuccessFollowCount = await recursiveFetchFollowersData(
        Number(result.scrapUrlData?.id),
        options.follow_count,
        0,
      );

      const endActivityData = {
        completedCount: totalSuccessFollowCount,
        endTime: new Date(),
        isStatus: 'N',
        isSuccess: Number(totalSuccessFollowCount) === Number(options.follow_count) ? 'Success' : 'UnSuccess',
        nextHref: '',
        id: result.currentLogData?.id,
      };
      const endActivityResponse = await fetch('/api/auth/end-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endActivityData),
      });

      const endActivityResponce = LogActivitySchema.parse(await endActivityResponse.json());

      if (endActivityResponce.id) {
        toast.success(`Followed ${String(totalSuccessFollowCount)} users`);
      }

      setActivity(false);
      setOptions(initiallyOptions);
    } catch (error) {
      setActivity(false);
      setOptions(initiallyOptions);
      logger.error('Fetch run activity error:', error instanceof Error ? error.message : error);
    }
  };

  const fetchFollowers = async (userId: number, limit: number, url: string): Promise<FollowersResponseData | null> => {
    try {
      const response = await fetch(`/api/auth/fetch-followers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, limit, url }),
      });

      if (!response.ok) {
        logger.error('Followers API Error:', (await response.json()) || 'Unknown error');
        return null;
      }

      return FollowersResponseSchema.parse(await response.json());
    } catch (error) {
      logger.error('Fetch Followers Error:', error);
      return null; // Explicitly return null in case of an error
    }
  };

  const followUser = async (userId: number): Promise<FollowUserResponseData | null | undefined> => {
    try {
      const response = await fetch('/api/auth/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      return FollowerSchema.parse(await response.json());
    } catch (error) {
      logger.error('Follow User Error:', error instanceof Error ? error.message : error);
    }
  };

  const cancelActivity = (): void => {
    setOptions(initiallyOptions);
    setActivity(false);
  };
  const handleActivityClick = (): void => {
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
            onClick={handleActivityClick}
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
