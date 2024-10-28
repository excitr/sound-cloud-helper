import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@repo/logger';

const TOKEN_KEY = process.env.TOKEN_KEY;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const DEFAULT_HOME_PATH = '/authorisation';

const publicPaths = ['/', '/home'];
const authPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

export const config = {
  matcher: ['/((?!api/auth|public|_next/static|_next/image|static|favicon.ico|bg.png).*)'],
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = TOKEN_KEY && request.cookies.get(TOKEN_KEY)?.value;

  // Refresh user's JWT if invalid (except if signing out)
  if (request.nextUrl.pathname !== '/api/auth/sign-out' && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(ACCESS_TOKEN_SECRET));
    } catch (err) {
      logger.error(err);
    }
  }

  const { pathname } = request.nextUrl;

  if (token) {
    if (isAuth(pathname)) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  } else if (!isAuth(pathname) && !isPublic(pathname)) {
    const redirectUrl = new URL('/sign-in', request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

const isPublic = (path: string): boolean => {
  return publicPaths.includes(path);
};

const isAuth = (path: string): boolean => {
  return authPaths.includes(path);
};
