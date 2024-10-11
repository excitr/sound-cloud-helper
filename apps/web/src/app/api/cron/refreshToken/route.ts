import { NextResponse } from 'next/server';
import { prisma } from '@repo/database'; // Assuming Prisma is set up correctly in your shared package
import SoundCloudClient from 'soundcloud'; // You need to create a client to handle SoundCloud API logic
import fs from 'fs';
import path from 'path';

// Define types for Account and SoundCloud response
type Account = {
  id: number;
  linked: string;
  access_token: string;
  refresh_token: string;
  token_created_at: number;
  token_expires_after: number;
};

type SoundCloudTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

const lockFilePath = path.join(process.cwd(), 'lock2');

async function lockFileMechanism(filePath: string): Promise<void> {
  // Simulating a file lock using fs
  return new Promise<void>((resolve, reject) => {
    fs.open(filePath, 'w', (err, fd) => {
      if (err) return reject('Cannot create lock file');
      fs.flock(fd, 'ex', (err) => {
        if (err) return reject('Error locking file');
        resolve();
      });
    });
  });
}

export async function GET() {
  const start_time = Math.floor(Date.now() / 1000);
  const max_execTime = 30; // Modify this as per your configuration
  const dtmr = 4;
  const till_time = start_time + (max_execTime < dtmr ? max_execTime : max_execTime - dtmr);

  // Lock mechanism to prevent cronjob overlapping
  try {
    await lockFileMechanism(lockFilePath);
  } catch (error) {
    return NextResponse.json({ error: 'Error locking file or already running' }, { status: 500 });
  }

  const cronHelper = new CronHelper(till_time); // You need to implement this class similar to your PHP logic
  let currentTime = Math.floor(Date.now() / 1000);

  while (currentTime < till_time) {
    await iterate();
    currentTime = Math.floor(Date.now() / 1000);
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulating sleep(4)
  }

  return NextResponse.json({ message: 'Cron job completed successfully' });
}

async function iterate() {
  const config = {
    refresh_token_before: 2 * 60 * 60, // Example from your PHP code
  };

  const client = new SoundCloudClient(); // Assuming this constructor sets up the API client

  // Fetch accounts that need refreshing
  const accounts = await prisma.account.findMany({
    where: {
      linked: 'Y',
      AND: [
        { tokenExpiresAfter: { gt: Math.floor(Date.now() / 1000) - config.refresh_token_before } },
        { tokenExpiresAfter: { lt: Math.floor(Date.now() / 1000) } },
      ],
    },
    orderBy: {
      tokenExpiresAfter: 'asc',
    },
    take: 60,
  });

  for (const account of accounts) {
    if (!account.accessToken.startsWith('2-292718')) {
      // Simulating the PHP check
      try {
        const fromsc: SoundCloudToke  nResponse | null = await client.accessTokenRefresh(account.refreshToken); // Assuming this method returns new tokens

        if (!fromsc) {
          console.warn(`Account ${account.id}: Cannot renew SoundCloud token`);
        } else {
          // Update the account with new tokens
          await prisma.account.update({
            where: { id: account.id },
            data: {
              accessToken: fromsc.access_token,
              tokenCreatedAt: Math.floor(Date.now() / 1000),
              tokenExpiresAfter: Math.floor(Date.now() / 1000) + fromsc.expires_in,
              refreshToken: fromsc.refresh_token,
            },
          });
        }
      } catch (error) {
        console.error(`Error refreshing token for account ${account.id}`, error);
      }

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating sleep(3)
    }
  }
}

class CronHelper {
  till_time: number;

  constructor(till_time: number) {
    this.till_time = till_time;
  }

  // You can add helper methods here as needed
}
