import { z } from 'zod';

export const Options = z.object({
  scrap_url: z.string(),
  follow: z.boolean(),
  pro_follow: z.boolean(),
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
