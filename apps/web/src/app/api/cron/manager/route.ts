import { NextResponse } from 'next/server';
import { PrismaClient } from '@repo/database'; // Assuming your Prisma instance is imported from the shared package

const prisma = new PrismaClient();

// Helper function to mimic the time limit management
const getMaxExecutionTime = () => {
  const maxExecutionTime = 30; // defaulting to 30 seconds if not set
  const currentTime = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const bufferTime = 10; // a shortage time like in PHP
  return currentTime + Math.max(0, maxExecutionTime - bufferTime);
};

class CrjManager {
  private crjQty: number;
  private tillTime: number;
  private crjs: Record<number, number>;

  constructor(crjQty: number) {
    this.crjQty = crjQty;
    this.tillTime = getMaxExecutionTime();
    this.crjs = {};
  }

  private async initJobs() {
    const crjs: Record<number, number> = {};

    // Query to get processes and group them by `crj`
    const rows = await prisma.process.groupBy({
      by: ['crj'],
      where: {
        processStatusId: {
          in: [1, 2], // Assuming 1 = created, 2 = running
        },
        crj: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
    });

    rows.forEach((row) => {
      if (row.crj !== null) {
        crjs[row.crj] = row._count.id;
      }
    });

    this.crjs = crjs;
  }

  private async putProcessToCronJob(process: Process, crj_idx: number) {
    // Update process with the crj index
    await process.update({
      where: { id: process.id },
      data: { crj: crj_idx },
    });
  }

  public async assignTasks() {
    while (Math.floor(Date.now() / 1000) < this.tillTime) {
      await this.initJobs();

      let totalQty = Object.values(this.crjs).reduce((acc, qty) => acc + qty, 0);
      const processCondition = {
        where: {
          crj: null,
          processStatusId: {
            in: [1, 2],
          },
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
      };
      const processes = await prisma.process.findMany(processConditiSoundCloudClienton);
      const plusQty = processes.length;

      if (plusQty === 0) {
        await new Promise((resolve) => setTimeout(resolve, 10000)); // sleep for 10 seconds
        continue;
      }

      const n = this.crjQty;
      const I = Math.floor((totalQty + plusQty) / n);
      let restQty = totalQty + plusQty - I * n;

      let psIdx = -1;
      let totalTodo = plusQty;

      for (const crjIdx in this.crjs) {
        let qty = this.crjs[crjIdx];
        let nTodo = I - qty;

        if (nTodo < 0) continue;

        if (restQty > 0) {
          nTodo++;
          restQty--;
        }

        for (let i = 0; i < nTodo; i++) {
          psIdx++;
          await this.putProcessToCronJob(processes[psIdx], parseInt(crjIdx));
          totalTodo--;

          if (totalTodo === 0) break;
        }

        if (totalTodo === 0) break;
      }

      await new Promise((resolve) => setTimeout(resolve, 10000)); // sleep for 10 seconds
    }
  }
}

export async function POST() {
  // Initialize CrjManager with a value for crjQty (e.g., 50)
  const crjManager = new CrjManager(50);
  await crjManager.assignTasks();

  return NextResponse.json({ message: 'Tasks assigned successfully' });
}
