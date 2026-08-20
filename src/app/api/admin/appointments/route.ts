import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';

    const appointments = await prisma.appointment.findMany({
      where: {
        AND: [
          doctorId ? { doctorId } : {},
          departmentId ? { departmentId } : {},
          status ? { status: status as string } : {},
          search
            ? {
                OR: [
                  { appointmentNo: { contains: search } },
                  { patient: { user: { name: { contains: search } } } },
                  { doctor: { user: { name: { contains: search } } } },
                  { reason: { contains: search } },
                ],
              }
            : {},
        ],
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, department: true } },
        department: true,
        invoice: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Fetch appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { appointmentId, status, paymentStatus, notes, date, timeSlot } = body;

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(status && { status: status as string }),
        ...(paymentStatus && { paymentStatus: paymentStatus as string }),
        ...(notes !== undefined && { notes }),
        ...(date && { date: new Date(date) }),
        ...(timeSlot && { timeSlot }),
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    // Notify patient
    await prisma.notification.create({
      data: {
        userId: updated.patient.userId,
        title: `Appointment Status Update: ${updated.appointmentNo}`,
        message: `Your appointment status has been updated to ${updated.status}.`,
        type: 'INFO',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_APPOINTMENT',
        module: 'Appointments',
        details: `Admin updated appointment ${updated.appointmentNo} to status ${updated.status}`,
      },
    });

    return NextResponse.json({ appointment: updated });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
