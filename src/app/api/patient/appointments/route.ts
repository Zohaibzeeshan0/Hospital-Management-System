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

    const appointments = await prisma.appointment.findMany({
      where: { patientId: user.patientProfile.id },
      include: {
        doctor: {
          include: { user: true, department: true },
        },
        department: true,
        invoice: true,
        prescription: {
          include: { items: true },
        },
        medicalRecord: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Patient appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.patientProfile) {
      return NextResponse.json({ error: 'Patient access required' }, { status: 403 });
    }

    const body = await req.json();
    const { doctorId, departmentId, date, timeSlot, reason, message, type } = body;

    if (!doctorId || !departmentId || !date || !timeSlot || !reason) {
      return NextResponse.json({ error: 'Please fill in all required appointment details.' }, { status: 400 });
    }

    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return NextResponse.json({ error: 'Cannot book appointments for past dates.' }, { status: 400 });
    }

    // 1. Verify Doctor is ACTIVE
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: { user: true, department: true },
    });

    if (!doctor || doctor.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'This doctor is currently unavailable or inactive for appointments.' }, { status: 400 });
    }

    // 2. Double-Booking Conflict Prevention Check
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingConflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: { gte: startOfDay, lte: endOfDay },
        timeSlot,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (existingConflict) {
      return NextResponse.json({ error: 'This time slot is no longer available. Please select another slot.' }, { status: 409 });
    }

    const appointmentNo = `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create Appointment in Database
    const appointment = await prisma.appointment.create({
      data: {
        appointmentNo,
        patientId: user.patientProfile.id,
        doctorId,
        departmentId: departmentId || doctor.departmentId,
        date: appointmentDate,
        timeSlot,
        reason: message ? `${reason} - Note: ${message}` : reason,
        type: type || 'In-Person',
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      },
      include: {
        doctor: { include: { user: true } },
        department: true,
      },
    });

    // 4. Create Notifications for Admin Users
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'New Appointment Request',
          message: `Patient ${user.name} requested an appointment with Dr. ${doctor.user.name} for ${appointmentDate.toLocaleDateString()} at ${timeSlot}`,
          type: 'INFO',
        },
      });
    }

    // 5. Create Notification for Doctor
    await prisma.notification.create({
      data: {
        userId: doctor.userId,
        title: 'New Patient Appointment Request',
        message: `Patient ${user.name} booked an appointment for ${timeSlot} on ${appointmentDate.toLocaleDateString()}`,
        type: 'INFO',
      },
    });

    // 6. Create Notification for Patient
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Appointment Request Submitted',
        message: `Your appointment request (${appointmentNo}) with Dr. ${doctor.user.name} for ${timeSlot} is pending confirmation.`,
        type: 'INFO',
      },
    });

    // 7. Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'BOOK_APPOINTMENT',
        module: 'Appointments',
        details: `Patient ${user.name} booked appointment ${appointmentNo} with Dr. ${doctor.user.name}`,
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error('Book appointment error:', error);
    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 });
  }
}
