import { z } from 'zod';

export const Options = z.object({
  scrap_url: z.string(),
  follow: z.string(),
  pro_follow: z.string(),
  unfollow: z.boolean(),
  passive_follow: z.boolean(),
  manual_follow: z.boolean(),
  schedule_activity: z.boolean(),
  schedule_time: z.string(),
  cycle: z.boolean(),
  max: z.boolean(),
  follow_count: z.number(),
  unfollow_count: z.number(),
});

// Create a TypeScript type from the Zod schema
export type OptionsSchema = z.infer<typeof Options>;

export const EndActivity = z.object({
  id: z.string(),
  completed_count: z.number(),
  end_time: z.date(),
  isStatus: z.string(),
  isSuccess: z.string(),
  nextHref: z.string(),
});

export type EndActivitySchema = z.infer<typeof EndActivity>;

export const LogActivitySchema = z.object({
  id: z.string(),
  activityType: z.string(),
  inputCount: z.number(),
  accountId: z.number(),
  completedCount: z.number(),
  isSuccess: z.string(),
  isStatus: z.string(),
  nextHref: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

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

export const FollowersResponseSchema = z.object({
  collection: z.array(FollowerSchema),
  next_href: z.string().url().nullable(),
});

export type FollowersResponseData = z.infer<typeof FollowersResponseSchema>;
