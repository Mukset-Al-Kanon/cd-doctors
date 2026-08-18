import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'CD Doctors Healthcare Information Platform',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
