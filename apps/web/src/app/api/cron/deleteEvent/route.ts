import { prisma } from '@repo/database'; // Adjust the import based on your project structure
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Calculate the date 14 days ago
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    // Connect to the database and perform the delete operation
    const deleteResult = await prisma.event.deleteMany({
      where: {
        timestamp: {
          lt: fourteenDaysAgo,
        },
      },
      take: 300000, // Limit the number of records to 300,000
    });

    return NextResponse.json({
      message: `${deleteResult.count} events deleted.`,
    });
  } catch (error: any) {
    console.error('Error deleting events:', error);
    return NextResponse.json(
      {
        message: 'Error deleting events',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
