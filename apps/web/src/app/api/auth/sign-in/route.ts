'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SignInSchema } from '@/utils/schemas/login-schemas1';
import { getUserByEmailAndPassword } from './login-api';

export async function POST(request: Request): Promise<NextResponse<{ success: true } | { success: false }>> {
  // Use type assertion to specify that the result of request.json() matches the expected shape
  const body = (await request.json()) as unknown; // Start with 'unknown' to ensure safe casting
  const parsed = SignInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      error: {
        message: 'Invalid form data',
        fields: body,
        issues: parsed.error.issues.map((issue) => issue.message),
      },
    });
  }

  const result = await getUserByEmailAndPassword(parsed.data);

  if (!result.success) {
    return NextResponse.json({ success: false, error: { message: result.error } });
  }

  const TOKEN_KEY = 'sound_cloud_token'; // Define or import this constant
  const REFRESH_TOKEN_KEY = 'sound_cloud_refresh_token';

  const cookieStore = cookies();
  cookieStore.set(TOKEN_KEY, result.token ? result.token : '');
  cookieStore.set(REFRESH_TOKEN_KEY, result.refreshToken ? result.refreshToken : '');

  return NextResponse.json({
    success: true,
    token: result.token,
    refreshToken: result.refreshToken,
  });
}
