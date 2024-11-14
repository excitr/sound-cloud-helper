import { z } from 'zod';
import { logger } from '@repo/logger';
import { SOUNDCLOUD_USERS_FOLLOWERS_URL } from '@/app/modules/constant';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const SubscriptionSchema = z.object({
  product: ProductSchema,
});

const FollowerSchema = z.object({
  avatar_url: z.string().url(),
  id: z.number(),
  kind: z.string(),
  permalink_url: z.string().url(),
  uri: z.string().url(),
  username: z.string(),
  permalink: z.string(),
  created_at: z.string(),
  last_modified: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  full_name: z.string(),
  city: z.string().nullable(),
  description: z.string().nullable(),
  country: z.string().nullable(),
  track_count: z.number(),
  public_favorites_count: z.number(),
  reposts_count: z.number(),
  followers_count: z.number(),
  followings_count: z.number(),
  plan: z.string(),
  myspace_name: z.string().nullable(),
  discogs_name: z.string().nullable(),
  website_title: z.string().nullable(),
  website: z.string().nullable(),
  comments_count: z.number(),
  online: z.boolean(),
  likes_count: z.number(),
  playlist_count: z.number(),
  subscriptions: z.array(SubscriptionSchema),
});

const FollowersResponseSchema = z.object({
  collection: z.array(FollowerSchema),
  next_href: z.string().url().nullable(),
});

type FollowersResponseData = z.infer<typeof FollowersResponseSchema>;

export const fetchFollowerData = async (accessToken: string, url: string): Promise<FollowersResponseData> => {
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

  return FollowersResponseSchema.parse(await response.json());
};
