'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, SOUNDCLOUD_ACCOUNT_ID, SOUNDCLOUD_TOKEN_KEY } from '@/app/modules/constant';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete(SOUNDCLOUD_ACCOUNT_ID);
  cookieStore.delete(SOUNDCLOUD_TOKEN_KEY);

  const url = new URL('/sign-in', request.nextUrl.origin);
  const redirectUrl = request.nextUrl.searchParams.get('redirect');

  if (redirectUrl) {
    url.searchParams.set('redirect', redirectUrl);
  }

  return NextResponse.redirect(url);
}
