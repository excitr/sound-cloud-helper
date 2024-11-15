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
  accountId: z.string(),
  followUserId: z.number(),
  completedCount: z.number(),
  isSuccess: z.string(),
  isStatus: z.string(),
  nextHref: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

const ProductSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
});

const SubscriptionSchema = z.object({
  product: ProductSchema,
});
export const FollowerSchema = z.object({
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

export type FollowResponseData = z.infer<typeof FollowerSchema>;

export const FollowersResponseSchema = z.object({
  collection: z.array(FollowerSchema),
  next_href: z.string().url().nullable(),
});

const ScrapUrlDataSchema = z.object({
  id: z.number(),
  followers_count: z.number(),
  followings_count: z.number(),
});

const LogDataSchema = z.object({
  id: z.string(),
  activityType: z.enum(['Follow', 'Like', 'Comment']), // Adjust if needed
  inputCount: z.number(),
  accountId: z.string(),
  completedCount: z.number(),
  isSuccess: z.union([z.boolean(), z.enum(['Success', 'UnSuccess']).nullable()]),
  isStatus: z.enum(['Y', 'N']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const StartActivitySchema = z.object({
  scrapUrlData: ScrapUrlDataSchema.nullable(),
  currentLogData: LogDataSchema.nullable(),
  lastLogData: LogDataSchema.nullable(),
  completedCountSum: z.number(),
});
export const ScrapUserErrorSchema = z.object({
  error: z.string(),
});

export const VerifyTokenResponceSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

export type FollowersResponseData = z.infer<typeof FollowersResponseSchema>;

export type FollowUserResponseData = z.infer<typeof FollowerSchema>;

export type VerifyTokenResponceData = z.infer<typeof VerifyTokenResponceSchema>;
