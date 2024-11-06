'use server';
import { prisma } from '@repo/database';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { logger } from '@repo/logger';
import { cookies } from 'next/headers';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/app/modules/constant';
import { generateAccessToken, generateRefreshToken } from './login-helper';

export interface APIResponse {
  success: boolean;
  id?: number;
  token?: string;
  refreshToken?: string;
  error?: string;
}

const UserSchema = z.object({
  id: z.number(),
  password: z.string(),
  contactEmail: z.string().email(),
});

export async function getUserByEmail(data: { email: string; password: string }): Promise<APIResponse> {
  try {
    const user = await prisma.user.findFirst({
      where: { contactEmail: data.email },
      select: { id: true, password: true, contactEmail: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'User Not Found',
      };
    }

    const validatedUser = UserSchema.parse(user);
    logger.info(validatedUser, 'validatedUser');
    const passwordMatch = await compare(data.password, validatedUser.password);

    if (!passwordMatch) {
      return {
        success: false,
        error: 'Incorrect credentials',
      };
    }

    const accessToken = generateAccessToken({ id: validatedUser.id, email: validatedUser.contactEmail });
    const refreshToken = generateRefreshToken({ id: validatedUser.id, email: validatedUser.contactEmail });

    const cookieStore = await cookies();

    cookieStore.set(TOKEN_KEY, accessToken);
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken);

    return {
      success: true,
      id: user.id,
    };
  } catch (error) {
    logger.error(error, 'Error:');
    return {
      success: false,
    };
  }
}
