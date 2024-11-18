'use server';

import { NextResponse } from 'next/server';
import { fetchUserActivity } from './actions';

export interface APIResponse {
  success: boolean;
  id?: number;
  activityTime?: string;
  error?: string;
}

export async function GET(): Promise<NextResponse<APIResponse>> {
  const result = await fetchUserActivity();

  return NextResponse.json(result);
}
