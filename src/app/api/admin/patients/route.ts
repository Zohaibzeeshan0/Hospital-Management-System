import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'DOCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const patients = await prisma.patientProfile.findMany({
      where: search
        ? {
            OR: [
              { user: { name: { contains: search } } },
              { user: { email: { contains: search } } },
              { patientCode: { contains: search } },
              { user: { phone: { contains: search } } },
            ],
          }
        : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            status: true,
            createdAt: true,
          },
        },
        appointments: {
          include: {
            doctor: { include: { user: true } },
            department: true,
          },
          orderBy: { date: 'desc' },
        },
        medicalRecords: {
          include: { doctor: { include: { user: true } } },
        },
        prescriptions: {
          include: { items: true, doctor: { include: { user: true } } },
        },
        labReports: true,
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Fetch patients error:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}
