import { NextResponse } from 'next/server';
import { prisma } from '@repo/database'; // Assuming Prisma instance is imported from shared package
import axios from 'axios';

const MAX_ATTEMPTS = 3;
const SC_TOKEN_URL = 'https://staging.soundcloudhelper.com/VOLCUA_PHP_Script_PROD/follow_p_oauth_set.php';

export async function POST(req: Request) {
  try {
    const { id, accountId } = await req.json(); // Parse the request body
    let process: any = null;

    await prisma.$transaction(async (prisma) => {
      // Fetch Account details
      const account = await prisma.account.findUnique({
        where: { id: accountId }, // Assuming accountId is passed in the request
      });

      if (!account) {
        throw new Error('Account not found');
      }

      const tokenExpiryTime = 0.8 * 60 * 60; // Assuming this is in your config
      const queryTime = Math.floor(Date.now() / 1000);
      const accountRefreshToken = account.refreshToken;
      // Refresh SoundCloud token if needed
      if (isSCTokenCloseToExpiration(account, tokenExpiryTime) && isSCTokenNonExpired(account)) {
        const refreshedToken = await refreshSoundCloudToken(process.account.refreshToken);

        if (!refreshedToken) {
          throw new Error('Cannot login to SoundCloud');
        }

        // Update account tokens in the database
        await prisma.account.update({
          where: { id: account.id },
          data: {
            accessToken: refreshedToken.access_token,
            tokenCreatedAt: queryTime,
            tokenExpiresAfter: queryTime + refreshedToken.expires_in,
            refreshToken: refreshedToken.refresh_token,
          },
        });
      }

      // Fetch Process by ID
      process = await prisma.process.findUnique({
        where: { id: Number(id) },
        include: { account: true }, // Assuming account relation is set up in Prisma schema
      });

      if (!process) {
        throw new Error('Process not found');
      }

      const accessToken = process.account.access_token;

      // Make external request to SoundCloud Helper
      await setSoundCloudAccessToken(accessToken);

      // Check if the daily activity limit is reached
      if (process.account.dailyActivityCnt >= 200) {
        throw new Error(`Daily limit of ${200} reached`);
      } else {
        if (process.account.timeleft === 0) {
          await pauseProcessDueToTimeCredits(process);
        } else {
          if (isSCTokenExpired(account)) {
            throw new Error('Token has expired');
          }

          // Process iteration logic (replace `iterateWith` with your actual logic)
          await process.iterateWith(sc_client);
        }

        // Reset failure count
        await prisma.process.update({
          where: { id: process.id },
          data: { failsInRow: 0 },
        });
      }
    });

    return NextResponse.json({ message: 'Process completed successfully.' }, { status: 200 });
  } catch (error) {
    return handleException(error);
  }
}

// Helper functions

async function setSoundCloudAccessToken(accessToken: string) {
  const url = `${SC_TOKEN_URL}?OAUTH=${accessToken}`;
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error('Failed to set SoundCloud access token');
  }
}

async function refreshSoundCloudToken(refreshToken: string) {
  try {
    const { data } = await axios.post('https://api.soundcloud.com/oauth2/token', {
      refresh_token: refreshToken,
    });
    return data;
  } catch (error) {
    throw new Error('Failed to refresh SoundCloud token');
  }
}

async function pauseProcessDueToTimeCredits(process: any) {
  await prisma.process.update({
    where: { id: process.id },
    data: { processStatus: 'PAUSED' },
  });
  throw new Error('Not enough time credits to continue.');
}

async function handleException(error: any) {
  const errorMessage = error.message || 'An unknown error occurred.';
  return NextResponse.json({ message: errorMessage }, { status: 500 });
}

// Placeholder functions
function isSCTokenCloseToExpiration(account: any, tokenExpiryTime: number): boolean {
  return account.token_expires_after - Date.now() / 1000 < tokenExpiryTime;
}

function isSCTokenNonExpired(account: any): boolean {
  return account.token_expires_after > Date.now() / 1000;
}

function isSCTokenExpired(account: any): boolean {
  return account.token_expires_after <= Date.now() / 1000;
}
