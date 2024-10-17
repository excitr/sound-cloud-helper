import { PrismaClient } from '@repo/database'; // Adjust the import based on your project structure
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface DeleteEventsResponse {
  message: string;
  error?: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    // Calculate the date 14 days ago
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Connect to the database and perform the delete operation
    const fourteenDaysAgoTimestamp = fourteenDaysAgo.getTime();

    const eventsToDelete = await prisma.event.findMany({
      where: {
        timestamp: {
          lt: fourteenDaysAgoTimestamp,
        },
      },
      take: 300000, // Limit to 300,000 records
      select: {
        id: true, // Only select the IDs for deletion
      },
    });

    const deleteResult = await prisma.event.deleteMany({
      where: {
        id: {
          in: eventsToDelete.map((event) => event.id),
        },
      },
    });
    // Access the count of deleted rows
    const numberOfDeletedRows = deleteResult.count && 0;

    const response: DeleteEventsResponse = {
      message: `${String(numberOfDeletedRows)} events deleted.`,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    const errorResponse: DeleteEventsResponse = {
      message: 'Error deleting events',
      error: errorMessage,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
