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
    CLINT_ID: z.string().min(1).default('client_id'),
    CLIENT_SECRET: z.string().min(1).default('client_secret'),
    CODE_VERIFIER: z.string().min(1).default('code_verifier'),
    DATABASE_URL: z
      .string()
      .regex(/^mysql:\/\/(?<username>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<database>[^/]+)$/, {
        message: 'Invalid DATABASE_URL. Must be a valid MySQL URL.',
      }),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    REFRESH_TOKEN_SECRET: z.string().min(1).default('refresh_token_secret'),
    REDIRECT_URL: z.string().min(1).default('redirect_uri'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLIENT_ID: z.string().min(1).default('xd14qP9rMwtXGyn7He27BzDoJmwlzjV4'),
    NEXT_PUBLIC_CODE_CHALLENGE: z.string().min(1).default('tLPc_OtzPcBUfqToSU3_2Q-Dw0I_T3DROyRQYo-q3Sk'),
    NEXT_PUBLIC_ENDPOINT: z.string().min(1).default('http://localhost:3000'),
    NEXT_PUBLIC_REDIRECT_URL: z.string().min(1).default('http://localhost:3000/api/auth/soundcloud/callback'),
    // Add `.min(1) on these if you want to make sure they're not empty
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    CLINT_ID: process.env.CLINT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CODE_VERIFIER: process.env.CODE_VERIFIER,
    CODE_CHALLENGE: process.env.CODE_CHALLENGE,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
    NEXT_PUBLIC_CLIENT_ID: process.env.CLINT_ID,
    NEXT_PUBLIC_CODE_CHALLENGE: process.env.CODE_CHALLENGE,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_REDIRECT_URL: process.env.REDIRECT_URL,
    REDIRECT_URL: process.env.REDIRECT_URL,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});
