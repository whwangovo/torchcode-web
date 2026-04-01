import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOrCreateUser, getProgress } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return NextResponse.json({ progress: {} });
  }

  const userId = getOrCreateUser(sessionToken);
  const progress = getProgress(userId);
  return NextResponse.json({ progress });
}
