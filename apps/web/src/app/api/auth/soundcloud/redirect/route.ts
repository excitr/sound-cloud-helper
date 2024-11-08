import { NextResponse } from 'next/server';
import { env } from '@/env.mjs';
import { SOUNDCLOUD_REDIRECT_URL } from '@/app/modules/constant';

export function GET(): NextResponse {
  const state = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const url = `https://secure.soundcloud.com/authorize?client_id=${env.SOUNDCLOUD_CLINT_ID}&redirect_uri=${env.BASE_URL}${SOUNDCLOUD_REDIRECT_URL}&response_type=code&code_challenge=${env.CODE_CHALLENGE}&code_challenge_method=S256&state=${state}`;

  // Redirect the user to the SoundCloud authorization page
  return NextResponse.redirect(url);
}
