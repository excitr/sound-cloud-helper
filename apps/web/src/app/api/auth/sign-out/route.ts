import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/app/modules/constant';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies(); // Await the promise returned by cookies()
  cookieStore.delete(TOKEN_KEY); // Now you can use delete
  cookieStore.delete(REFRESH_TOKEN_KEY);

  const url = new URL(`/sign-in`);
  const redirectUrl = request.nextUrl.searchParams.get('redirect');

  if (redirectUrl) {
    url.searchParams.set('redirect', redirectUrl);
  }

  return NextResponse.redirect(url); // Use NextResponse.redirect for proper redirection
}
