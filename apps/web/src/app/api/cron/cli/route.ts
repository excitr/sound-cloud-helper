import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import jwt from 'jsonwebtoken';

// Function to get todo processes
async function getTodoProcesses(idx: number) {
  return await prisma.process.findMany({
    where: {
      crj: idx,
      OR: [{ processStatusId: 1 }, { processStatusId: 2 }],
      scheduledProcess: {
        some: {
          startTimestamp: {
            lt: Math.floor(Date.now() / 1000),
          },
        },
      },
    },
    include: {
      scheduledProcess: {
        orderBy: {
          startTimestamp: 'asc',
        },
      },
    },
  });
}

// Function to get latest refresh token for a user
async function getLatestRefreshTokenForUserId(userId: number) {
  const tokens = await prisma.refreshToken.findMany({
    where: {
      userId,
      valid: 'Y',
    },
    orderBy: {
      expiresAt: 'desc',
    },
    take: 1,
  });
  return tokens.length > 0 ? tokens[0] : null;
}

// Function to iterate through the processes
async function processIterate(process: any, config: any, req: Request) {
  const { user, account } = process;

  if (!account.isLinked) {
    console.log(`Account is not linked, id: ${account.id}`);
    return;
  }

  const refreshToken = await getLatestRefreshTokenForUserId(user.id);
  if (!refreshToken) {
    console.log(`No refresh token for user id: ${user.id}`);
    return;
  }

  const payload = {
    uid: user.id,
    ver: user.jwt_version,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + config.token.duration,
    login: account.login,
    account_id: account.id,
    rtkn: refreshToken.id,
    role: user.role.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  const response = await fetch(`${req.headers.get('origin')}/processes/iterate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mark: refreshToken.jwtMark }),
  });

  if (response.ok) {
    console.log('Process iteration successful:', await response.json());
  } else {
    console.error('Error in process iteration:', await response.text());
  }
}

// API Route handler
export async function POST(req: Request) {
  const { idx } = await req.json();

  if (!idx) {
    return NextResponse.json({ error: 'idx parameter is required' }, { status: 400 });
  }

  const tillTime = Date.now() + 270 * 1000; // 270 seconds

  try {
    while (Date.now() < tillTime) {
      const processes = await getTodoProcesses(idx);
      if (processes.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 50000)); // Sleep for 50 seconds
      } else {
        for (const process of processes) {
          try {
            await processIterate(process, { token: { duration: 3600 } }, req);
          } catch (e) {
            console.error('Error processing:', e);
          }
        }
        // Small sleep between process iterations
        await new Promise((resolve) =>
          setTimeout(resolve, processes.length === 1 ? 6000 : processes.length === 2 ? 4000 : 2000),
        );
      }
    }

    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error in cronjob:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
