import { NextResponse } from 'next/server';
import { Prisma, prisma } from '@repo/database'; // Importing Prisma instance

interface GetArrayFromProcessReturn {
  id: number;
  status: string;
}

interface ResumeLatestProcessReturn {
  process: GetArrayFromProcessReturn;
  count: number;
}

const processWithAccountStatus = Prisma.validator<Prisma.ProcessDefaultArgs>()({
  include: { processStatus: true, account: true },
  select: { id: true, processStatusId: true, accountId: true },
});

type ProcessWithaccountAndStatus = Prisma.ProcessGetPayload<typeof processWithAccountStatus>;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const accountId = await getAccountId(request); // Implement this to extract account ID from the request
    return await resumeLatestProcess(accountId);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request.' },
      { status: 500 },
    );
  }
}

async function resumeLatestProcess(accountId: number): Promise<NextResponse> {
  const result: ResumeLatestProcessReturn = {
    process: {
      id: 0,
      status: '',
    },
    count: 0,
  };

  try {
    // await prisma.$transaction(async (prisma) => {
    // Query to get the latest process
    const process = await prisma.process.findFirst({
      where: {
        accountId,
      },
      orderBy: {
        id: 'desc',
      },
      ...processWithAccountStatus,
    });

    if (process) {
      // Check if account has enough time left to resume the process
      if ((await timeLeft(process.account.id)) === 0) {
        throw new Error('Not enough time credits to resume.');
      }

      // Resume the process if it is paused
      await resumeProcess(process);

      // Open a new activity record
      await openActivityRecord(accountId);

      // Prepare success result
      result.process = await getArrayFromProcess(process);
      result.count = 1;
    }
    // });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    throw new Error('An error occurred while resuming the process'); // Handle as necessary
  }
}

async function resumeProcess(process: ProcessWithaccountAndStatus): Promise<void> {
  // Check if the process is paused
  if (!isPaused(process)) {
    throw new Error(`Cannot resume: wrong status '${process.processStatus.name ?? ''}'`);
  }

  const processStatusName = await prisma.processStatus.findFirst({
    where: {
      name: 'running',
    },
  });

  // Update the process status to running
  await prisma.process.update({
    where: { id: process.id },
    data: { processStatusId: processStatusName?.id }, // Replace with your actual running status
  });
}

const isPaused = (process: ProcessWithaccountAndStatus): boolean => process.processStatus.name === 'paused'; // Replace with your actual paused status;

async function openActivityRecord(accountId: number): Promise<void> {
  // Close any existing activity records
  await closeActivityRecord(accountId);

  // Open a new activity record
  await prisma.activity.create({
    data: {
      accountId,
      t1: Math.floor(Date.now() / 1000), // Current timestamp in seconds
    },
  });
}

async function closeActivityRecord(accountId: number): Promise<void> {
  const activity = await prisma.activity.findFirst({
    where: {
      accountId,
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

const getArrayFromProcess = (process: ProcessWithaccountAndStatus): Promise<GetArrayFromProcessReturn> => {
  return Promise.resolve({
    id: process.id,
    status: process.processStatus.name,
  } as GetArrayFromProcessReturn);
};

async function timeLeft(accountId: number): Promise<number> {
  // Implement the logic to calculate time left for the account
  // This is a placeholder and should be replaced with the actual logic
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { user: true },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  return account.user.timeLeft ?? 0; // Assuming 'time_left' is a field in your account model
}

// Placeholder function for extracting account ID from the request
async function getAccountId(request: Request): Promise<number> {
  // Implement your logic to retrieve account ID from the request (e.g., from headers or body)
  const { accountId } = (await request.json()) as { accountId: number };
  return accountId; // Ensure you validate this
}
