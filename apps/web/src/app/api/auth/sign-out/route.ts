import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { env } from '@/env.mjs';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/app/modules/constant';

export function GET(request: NextRequest): void {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  const url = new URL(`${env.NEXT_PUBLIC_ENDPOINT}/sign-in`);
  const redirectUrl = request.nextUrl.searchParams.get('redirect');
  if (redirectUrl) {
    url.searchParams.set('redirect', redirectUrl);
  }
  redirect(url.toString());
}