import { NextResponse } from 'next/server';
import { Prisma, prisma } from '@repo/database'; // Importing Prisma instance

interface GetArrayFromProcessReturn {
  id: number;
  status: string;
}

interface LatestProcessReturn {
  process: GetArrayFromProcessReturn;
  count: number;
}

const processWithScheduled = Prisma.validator<Prisma.ProcessDefaultArgs>()({
  include: { scheduledProcess: true, processStatus: true },
  select: { id: true, scheduledProcess: true, processStatusId: true },
});

type ProcessWithScheduled = Prisma.ProcessGetPayload<typeof processWithScheduled>;

export async function POST(request: Request): Promise<NextResponse> {
  const accountId = await getAccountId(request); // Implement this to extract account ID from the request
  return pauseLatestProcess(accountId);
}

async function pauseLatestProcess(accountId: number): Promise<NextResponse> {
  const result: LatestProcessReturn = {
    process: {
      id: 0,
      status: '',
    },
    count: 0,
  };

  try {
    // Begin transaction
    const process = await prisma.$transaction(async (px) => {
      return await px.process.findFirst({
        where: {
          accountId,
        },
        orderBy: {
          id: 'desc',
        },
        ...processWithScheduled,
      });
    });

    if (process) {
      // Pause the process
      await pauseProcess(process);

      // Close the latest activity record
      await closeActivityRecord(accountId);

      // Prepare success response
      result.process = await getArrayFromProcess(process);
      result.count = 1;
    } else {
      result.count = 0;
    }
    // });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    throw new Error('An error occurred while pausing the process'); // Handle as necessary
  }
}

async function pauseProcess(process: ProcessWithScheduled): Promise<void> {
  // Check if the process is paused
  if (!isRunning(process)) {
    throw new Error(`Cannot resume: wrong status '${process.processStatus.name ?? ''}'`);
  }

  const processStatusName = await prisma.processStatus.findFirst({
    where: {
      name: 'paused',
    },
  });

  // Update the process status to running
  await prisma.process.update({
    where: { id: process.id },
    data: { processStatusId: processStatusName?.id }, // Replace with your actual running status
  });
}

const isRunning = (process: ProcessWithScheduled): boolean => process.processStatus.name === 'running';

async function closeActivityRecord(accountId: number): Promise<void> {
  const activity = await prisma.activity.findFirst({
    where: {
      accountId,
    },
    orderBy: {
      id: 'desc',
    },
  });

  if (activity && !activity.t2) {
    activity.t2 = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    await prisma.activity.update({
      where: { id: activity.id },
      data: { t2: activity.t2 },
    });
  }
}

const getArrayFromProcess = (process: ProcessWithScheduled): Promise<GetArrayFromProcessReturn> => {
  return Promise.resolve({
    id: process.id,
    status: process.processStatus.name,
  } as GetArrayFromProcessReturn);
};

// Placeholder function for extracting account ID from the request
async function getAccountId(request: Request): Promise<number> {
  // Implement your logic to retrieve account ID from the request (e.g., from headers or body)
  const { accountId } = (await request.json()) as { accountId: number };
  return accountId; // Ensure you validate this
}
