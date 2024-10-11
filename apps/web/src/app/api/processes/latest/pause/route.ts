import { NextResponse } from 'next/server';
import { prisma } from '@repo/database'; // Importing Prisma instance

export async function POST(request: Request) {
  const accountId = await getAccountId(request); // Implement this to extract account ID from the request
  return pauseLatestProcess(accountId);
}

async function pauseLatestProcess(accountId: number): Promise<NextResponse> {
  let result: any = {};

  try {
    // Begin transaction
    await prisma.$transaction(async (px) => {
      return await px.process.findFirst({
        where: {
          accountId: accountId,
        },
        orderBy: {
          id: 'desc',
        },
        include: {
          scheduledProcess: true, // Include related scheduledProcess
        },
      });
    });

    if (process) {
      // Pause the process
      await pauseProcess(prisma, process);

      // Close the latest activity record
      await closeActivityRecord(prisma, accountId);

      // Prepare success response
      result.process = getArrayFromProcess(process);
      result.count = 1;
    } else {
      result.count = 0;
    }
    // });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error pausing process:', error);
    throw NextResponse.json('An error occurred while pausing the process'); // Handle as necessary
  }
}

async function pauseProcess(prisma: any, process: any) {
  const pausedStatus = 'paused'; // Define your paused status as per your model
  // await prisma.process.update({
  //   where: { id: process.id },
  //   data: { status: pausedStatus },
  // });

  log(`Process ${process.id} paused`); // Log the action
}

async function closeActivityRecord(prisma: any, accountId: number) {
  const activity = await prisma.activity.findFirst({
    where: {
      accountId: accountId,
    },
    orderBy: {
      id: 'desc',
    },
  });
  console.log('activity', activity);

  if (activity && !activity.t2) {
    activity.t2 = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    await prisma.activity.update({
      where: { id: activity.id },
      data: { t2: activity.t2 },
    });
  }
}

function log(message: string) {
  console.log(`Log: ${message}`);
  // You can implement a proper logging mechanism if needed
}

function getArrayFromProcess(process: any) {
  return {
    id: process.id,
    status: process.status,
    // Add more fields as needed
  };
}

// Placeholder function for extracting account ID from the request
async function getAccountId(request: Request): Promise<number> {
  // Implement your logic to retrieve account ID from the request (e.g., from headers or body)
  const { accountId } = await request.json();
  return accountId; // Ensure you validate this
}
