import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'DOCTOR' || !user.doctorProfile) {
      return NextResponse.json({ error: 'Doctor access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all'; // 'today', 'upcoming', 'all'

    const doctorId = user.doctorProfile.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateFilter = {};
    if (filter === 'today') {
      dateFilter = { gte: today, lt: tomorrow };
    } else if (filter === 'upcoming') {
      dateFilter = { gte: tomorrow };
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        ...(filter !== 'all' ? { date: dateFilter } : {}),
      },
      include: {
        patient: {
          include: { user: true },
        },
        department: true,
        medicalRecord: true,
        prescription: {
          include: { items: true },
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Fetch doctor appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'DOCTOR' || !user.doctorProfile) {
      return NextResponse.json({ error: 'Doctor access required' }, { status: 403 });
    }

    const body = await req.json();
    const {
      appointmentId,
      action, // 'CONFIRM', 'REJECT', 'COMPLETE'
      diagnosis,
      symptoms,
      treatmentPlan,
      notes,
      prescriptionItems, // Array of { medicineName, dosage, frequency, duration, instructions }
    } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });

    if (!appointment || appointment.doctorId !== user.doctorProfile.id) {
      return NextResponse.json({ error: 'Appointment not found or unauthorized' }, { status: 404 });
    }

    if (action === 'CONFIRM') {
      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' },
      });
      return NextResponse.json({ appointment: updated });
    }

    if (action === 'REJECT') {
      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED', notes },
      });
      return NextResponse.json({ appointment: updated });
    }

    if (action === 'COMPLETE') {
      // 1. Mark appointment completed
      const updatedAppt = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'COMPLETED',
          notes,
        },
      });

      // 2. Create Medical Record
      let record;
      if (diagnosis && symptoms) {
        record = await prisma.medicalRecord.create({
          data: {
            patientId: appointment.patientId,
            doctorId: user.doctorProfile.id,
            appointmentId: appointment.id,
            diagnosis,
            symptoms,
            treatmentPlan: treatmentPlan || '',
            doctorNotes: notes || '',
          },
        });
      }

      // 3. Create Digital Prescription if items provided
      if (prescriptionItems && Array.isArray(prescriptionItems) && prescriptionItems.length > 0) {
        const presNo = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await prisma.prescription.create({
          data: {
            prescriptionNo: presNo,
            patientId: appointment.patientId,
            doctorId: user.doctorProfile.id,
            appointmentId: appointment.id,
            instructions: notes || 'Take medications as prescribed.',
            items: {
              create: prescriptionItems.map((item: any) => ({
                medicineName: item.medicineName,
                dosage: item.dosage,
                frequency: item.frequency,
                duration: item.duration,
                instructions: item.instructions || '',
              })),
            },
          },
        });
      }

      // 4. Create Invoice for consultation fee
      const invNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await prisma.invoice.create({
        data: {
          invoiceNo: invNo,
          patientId: appointment.patientId,
          appointmentId: appointment.id,
          totalAmount: user.doctorProfile.consultationFee,
          status: 'UNPAID',
          dueDate: new Date(Date.now() + 86400000 * 7),
        },
      });

      // 5. Notify patient
      await prisma.notification.create({
        data: {
          userId: appointment.patient.userId,
          title: 'Consultation Completed & Prescription Ready',
          message: `Your consultation with Dr. ${user.name} is complete. Medical record and prescription are available in your portal.`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({ appointment: updatedAppt, record });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Doctor consultation error:', error);
    return NextResponse.json({ error: 'Failed to process consultation' }, { status: 500 });
  }
}
