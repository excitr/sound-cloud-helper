'use server';

import { NextResponse } from 'next/server';
import { SignInSchema } from '@/utils/schemas/login-schemas';
import { fetchUserByEmail } from './login-actions';

export async function POST(request: Request): Promise<NextResponse<{ success: true } | { success: false }>> {
  const body = (await request.json()) as unknown;
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

  const result = await fetchUserByEmail(parsed.data);

  return NextResponse.json(result);
}
