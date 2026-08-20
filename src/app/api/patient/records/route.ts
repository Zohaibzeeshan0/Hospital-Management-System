import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.patientProfile) {
      return NextResponse.json({ error: 'Patient access required' }, { status: 403 });
    }

    const patientId = user.patientProfile.id;

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        doctor: { include: { user: true, department: true } },
        appointment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId },
      include: {
        doctor: { include: { user: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const labReports = await prisma.labReport.findMany({
      where: { patientId },
      include: {
        doctor: { include: { user: true } },
      },
      orderBy: { testDate: 'desc' },
    });

    const invoices = await prisma.invoice.findMany({
      where: { patientId },
      include: {
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      medicalRecords,
      prescriptions,
      labReports,
      invoices,
    });
  } catch (error) {
    console.error('Fetch patient records error:', error);
    return NextResponse.json({ error: 'Failed to fetch medical records' }, { status: 500 });
  }
}
