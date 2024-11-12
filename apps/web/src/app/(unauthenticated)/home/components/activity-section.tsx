'use client';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { logger } from '@repo/logger';
import { rem } from '@/theme';
import { useHomePageContext } from '../context';

const ScrapUserErrorSchema = z.object({
  error: z.string(),
});
const ScrapUserResponseSchema = z.object({
  id: z.number(),
  followers_count: z.number(),
  followings_count: z.number(),
});

const FollowResponseSchema = z.object({
  success: z.boolean(),
  id: z.number(),
});

const FollowersResponseSchema = z.array(
  z.object({
    id: z.number(),
    username: z.string(),
  }),
);
type FollowersData = ReturnType<typeof FollowersResponseSchema.parse>;

export default function ActivitySection(): React.JSX.Element {
  const { activity, setActivity, options } = useHomePageContext();

  const handleActivity = async (): Promise<void> => {
    setActivity(true);
    await runActivity();
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

      const userData = ScrapUserResponseSchema.parse(await response.json());
      const followers = await fetchFollowers(userData.id);

      if (followers) {
        for (const follower of followers) {
          const followResponse = await followUser(follower.id);
          if (followResponse) {
            toast.success(`Followed ${follower.username}`);
          } else {
            toast.error(`Failed to follow ${follower.username}`);
          }
        }
      }

      setActivity(false);
    } catch (error) {
      setActivity(false);
      toast.error(`Failed to follow ${follower.username}`);
      logger.error('Fetch run activity error:', error instanceof Error ? error.message : error);
    }
  };

  const fetchFollowers = async (userId: number): Promise<FollowersData | null> => {
    try {
      const response = await fetch(`/api/auth/fetch-followers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, limit: 5 }),
      });
      logger.info(await response.json(), 'fetchfolloers');

      if (!response.ok) {
        logger.error('Followers API Error:', (await response.json()) || 'Unknown error');
        return null;
      }

      const followersData = FollowersResponseSchema.parse(await response.json());

      return followersData;
    } catch (error) {
      logger.error('Fetch Followers Error:', error instanceof Error ? error.message : error);
      throw error; // Re-throws the error to be handled by the caller
    }
  };

  const followUser = async (userId: number) => {
    try {
      const response = await fetch('/api/auth/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        logger.error('Follow API Error:', (await response.json()) || 'Unknown error');
        return false;
      }

      const followData = FollowResponseSchema.parse(await response.json());

      return followData.success;
    } catch (error) {
      logger.error('Follow User Error:', error instanceof Error ? error.message : error);
      return false;
    }
  };

  const cancelActivity = (): void => {
    setActivity(false);
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
            onClick={handleActivity}
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

        {activity && (
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
