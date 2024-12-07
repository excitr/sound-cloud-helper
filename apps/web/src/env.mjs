import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   *
   * Don't forget to expose this variables to the server-side runtime in amplify.yml:
   *  - env | grep -e EXAMPLE_1 -e EXAMPLE_2 >> apps/web/.env.production
   */
  server: {
    ACCESS_TOKEN_SECRET: z.string().min(1).default('access_token_secret'),
    SOUNDCLOUD_CLINT_ID: z.string().min(1).default('client_id'),
    SOUNDCLOUD_CLIENT_SECRET: z.string().min(1).default('client_secret'),
    CODE_VERIFIER: z.string().min(1).default('code_verifier'),
    CODE_CHALLENGE: z.string().min(1).default('code_challenge'),
    DATABASE_URL: z
      .string()
      .regex(/^mysql:\/\/(?<username>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<database>[^/]+)$/, {
        message: 'Invalid DATABASE_URL. Must be a valid MySQL URL.',
      }),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    REFRESH_TOKEN_SECRET: z.string().min(1).default('refresh_token_secret'),
    SOUNDCLOUD_REDIRECT_URL: z.string().min(1).default('http://localhost:3000/api/auth/soundcloud/callback'),
    BASE_URL: z.string().min(1).default('http://localhost:3000'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // Add `.min(1) on these if you want to make sure they're not empty
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    SOUNDCLOUD_CLINT_ID: process.env.SOUNDCLOUD_CLINT_ID,
    CODE_CHALLENGE: process.env.CODE_CHALLENGE,
    SOUNDCLOUD_CLIENT_SECRET: process.env.SOUNDCLOUD_CLIENT_SECRET,
    CODE_VERIFIER: process.env.CODE_VERIFIER,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    SOUNDCLOUD_REDIRECT_URL: process.env.SOUNDCLOUD_REDIRECT_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});
