import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@repo/logger';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from './app/modules/constant';
import { env } from './env.mjs';

export const DEFAULT_HOME_PATH = '/authorisation';

const publicPaths = ['/', '/home', '/api/auth/soundcloud/redirect'];
const authPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

export const config = {
  matcher: ['/((?!api/auth|public|_next/static|_next/image|static|souldCloudlogo.ico|bg.avif).*)'],
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;

  // Refresh user's JWT if invalid (except if signing out)
  if (request.nextUrl.pathname !== '/api/auth/sign-out' && token) {
    try {
      const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
      await jwtVerify(token, new TextEncoder().encode(ACCESS_TOKEN_SECRET));
    } catch (err) {
      logger.error(err);
      return tryRefreshToken(err, refreshToken, request);
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

const signOut = (request: NextRequest): NextResponse => {
  const signOutUrl = new URL('/api/auth/sign-out', request.url);
  signOutUrl.searchParams.set('redirect', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signOutUrl);
};

const tryRefreshToken = (
  err: unknown,
  refreshToken: string | undefined,
  request: NextRequest,
): Promise<NextResponse> => {
  if (err && typeof err === 'object' && 'code' in err && err.code === 'ERR_JWT_EXPIRED' && refreshToken) {
    // TO-DO: write code for refresh token
    return Promise.resolve(signOut(request)); // Wrap in Promise
  }
  logger.error(err);
  return Promise.resolve(signOut(request));
};
