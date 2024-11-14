'use server';
import { z } from 'zod';
//import { logger } from '@repo/logger';
import { SOUNDCLOUD_ME_URL } from '@/app/modules/constant';
import { logger } from '@repo/logger';

// const FollowerResponseSchema = z.object({
//   status: z.string(),
// });

//type FollowResponseInfo = z.infer<typeof FollowerResponseSchema>;

const ProductSchema = z.object({
  id: z.string().nullable(),

  name: z.string().nullable(),
});

const SubscriptionSchema = z.object({
  product: ProductSchema,
});

const FollowResponseSchema = z.object({
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
  public_favorites_count: z.number(),
  reposts_count: z.number(),
  followers_count: z.number(),
  followings_count: z.number(),
  plan: z.string().nullable(),
  myspace_name: z.string().nullable(),
  discogs_name: z.string().nullable(),
  website_title: z.string().nullable(),
  website: z.string().nullable(),
  comments_count: z.number().nullable(),
  online: z.boolean().nullable(),
  likes_count: z.number().nullable(),
  playlist_count: z.number().nullable(),
  subscriptions: z.array(SubscriptionSchema),
});
type FollowResponseData = z.infer<typeof FollowResponseSchema>;

export interface APIResponse {
  success: boolean;
}

export const followUser = async (accessToken: string, id: number): Promise<FollowResponseData> => {
  try {
    const followUserId = id.toString();
    const url = `${SOUNDCLOUD_ME_URL}/followings/${followUserId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json; charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return FollowResponseSchema.parse(await response.json());
  } catch (error) {
    logger.error(error, `soundcloud follow request`);
  }
};
