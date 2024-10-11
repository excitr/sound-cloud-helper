import { NextResponse } from 'next/server';
import { prisma } from '@repo/database'; // Importing Prisma instance

export async function POST(request: Request) {
  try {
    const accountId = await getAccountId(request); // Implement this to extract account ID from the request
    return await resumeLatestProcess(accountId);
  } catch (error) {
    console.error('Error in POST /api/resumeLatestProcess:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request.' },
      { status: 500 },
    );
  }
}

async function resumeLatestProcess(accountId: number): Promise<NextResponse> {
  let result: any = {};

  try {
    // await prisma.$transaction(async (prisma) => {
    // Query to get the latest process
    const process = await prisma.process.findFirst({
      where: {
        accountId: accountId,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        account: true, // Assuming 'account' relation exists
      },
    });

    if (process) {
      // Check if account has enough time left to resume the process
      if ((await timeLeft(prisma, process.account.id)) === 0) {
        throw NextResponse.json('Not enough time credits to resume.');
      }

      console.log('=========================');
      // Resume the process if it is paused
      await resumeProcess(prisma, process);

      // Open a new activity record
      await openActivityRecord(prisma, accountId);

      // Prepare success result
      result.process = getArrayFromProcess(process);
      result.count = 1;
    } else {
      result.count = 0;
    }
    // });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error resuming process:', error);
    throw NextResponse.json('An error occurred while resuming the process'); // Handle as necessary
  }
}

async function resumeProcess(prisma: any, process: any) {
  console.log('isPaused================================', isPaused(process));
  // Check if the process is paused
  if (!isPaused(process)) {
    throw NextResponse.json(`Cannot resume: wrong status '${process.status}'`);
  }

  // Update the process status to running
  await prisma.process.update({
    where: { id: process.id },
    data: { status: 'running' }, // Replace with your actual running status
  });

  log(`Process ${process.id} resumed`);
}

function isPaused(process: any) {
  return process.status === 'paused'; // Replace with your actual paused status
}

async function openActivityRecord(prisma: any, accountId: number) {
  // Close any existing activity records
  await closeActivityRecord(prisma, accountId);

  // Open a new activity record
  await prisma.activity.create({
    data: {
      accountId: accountId,
      t1: Math.floor(Date.now() / 1000), // Current timestamp in seconds
    },
  });
}

async function closeActivityRecord(prisma: any, accountId: number) {
  const activity = await prisma.activity.findFirst({
    where: {
      accountId: accountId,
      t2: null, // Find open activity record
    },
    orderBy: {
      id: 'desc',
    },
  });

  if (activity) {
    await prisma.activity.update({
      where: { id: activity.id },
      data: { t2: Math.floor(Date.now() / 1000) }, // Set close timestamp
    });
  }
}

function getArrayFromProcess(process: any) {
  return {
    id: process.id,
    status: process.status,
    // Add more fields as necessary
  };
}

async function timeLeft(prisma: any, accountId: number): Promise<number> {
  // Implement the logic to calculate time left for the account
  // This is a placeholder and should be replaced with the actual logic
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw NextResponse.json('Account not found');
  }

  return account.time_left || 0; // Assuming 'time_left' is a field in your account model
}

function log(message: string) {
  console.log(`Log: ${message}`);
  // You can implement a proper logging mechanism if needed
}

// Placeholder function for extracting account ID from the request
async function getAccountId(request: Request): Promise<number> {
  // Implement your logic to retrieve account ID from the request (e.g., from headers or body)
  const { accountId } = await request.json();
  return accountId; // Ensure you validate this
}
