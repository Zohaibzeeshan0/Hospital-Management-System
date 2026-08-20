import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalog = await prisma.labTestCatalog.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ catalog });
  } catch (error) {
    console.error('Fetch lab catalog error:', error);
    return NextResponse.json({ catalog: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { name, testCode, category, price, sampleType, turnaround } = await req.json();

    const test = await prisma.labTestCatalog.create({
      data: {
        name,
        testCode: testCode.toUpperCase(),
        category,
        price: Number(price),
        sampleType: sampleType || 'Blood',
        turnaround: turnaround || '24 Hours',
      },
    });

    return NextResponse.json({ test }, { status: 201 });
  } catch (error) {
    console.error('Create lab test error:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}
