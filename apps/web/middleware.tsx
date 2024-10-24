import { jwtVerify, decodeJwt, type JWTPayload } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@repo/logger';

const TOKEN_KEY = 'sound_cloud_token';
//const REFRESH_TOKEN_KEY = 'sound_cloud_refresh_token';'

export const DEFAULT_HOME_PATH = '/authorisation';
//const DEFAULT_MISSING_PATH = '/home';
const publicPaths = ['/', '/sign-in', '/sign-up', '/home'];

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  //const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;
  logger.info('token', token);
  let tokenData: JWTPayload | undefined;
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
      tokenData = decodeJwt(token);
    } catch (error: unknown) {
      logger.error(error);
    }
  }

  // Redirect to correct route if visiting the root url
  if (request.nextUrl.pathname === '/') {
    if (token) {
      const redirectUrl = getDefaultRedirectURL(request, tokenData);
      return NextResponse.redirect(redirectUrl);
    }
    const redirectUrl = new URL('/sign-in', request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  // Refresh user's JWT if invalid (except if signing out)
  if (request.nextUrl.pathname !== '/api/auth/sign-out' && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    } catch (err) {
      logger.error(err);
      //return tryRefreshToken(err, refreshToken, request);
    }
  }

  // If attempting to visit a public URL or the DEFAULT_MISSING_ORG_PATH while already signed in, redirect to default page
  if (isPublic(request.nextUrl.pathname) && token) {
    const redirectUrl = getDefaultRedirectURL(request, tokenData);
    return NextResponse.redirect(redirectUrl);
  }

  // If attempting to visit an authenticated URL without a JWT, redirect to sign in
  // & after successful sign in, redirect to the desired page
  if (!isPublic(request.nextUrl.pathname) && !token) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// The default redirect is on insights, but if no current org exists then the user should be redirected to the org warning page
const getDefaultRedirectURL = (request: NextRequest, tokenData: JWTPayload | undefined): URL => {
  if (tokenData) {
    return new URL(DEFAULT_HOME_PATH, request.url);
  }
  return new URL('/sign-in', request.url);
};

const isPublic = (path: string): boolean => {
  return publicPaths.includes(path);
};

// const tryRefreshToken = async (
//   err: unknown,
//   refreshToken: string | undefined,
//   request: NextRequest,
// ): Promise<NextResponse> => {
//   if (err && typeof err === 'object' && 'code' in err && err.code === 'ERR_JWT_EXPIRED' && refreshToken) {
//     logger.info('Refreshing token');
//     const newRefreshToken = await fetch(`${request.nextUrl.origin}/api/auth/generate-refreshtoken`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ refreshToken }), // Make sure to JSON-encode the body
//     });

//     if (newRefreshToken.success) {
//       const response = NextResponse.redirect(request.url);
//       response.cookies.set(TOKEN_KEY, newRefreshToken.accessToken);
//       return response;
//     }
//     return signOut(request);
//   }
//   logger.error(err);
//   return signOut(request);
// };

// const signOut = (request: NextRequest): NextResponse => {
//   const signOutUrl = new URL('/api/auth/sign-out', request.url);
//   signOutUrl.searchParams.set('redirect', `${request.nextUrl.pathname}${request.nextUrl.search}`);
//   return NextResponse.redirect(signOutUrl);
// };
