import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ error: 'Date query parameter is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const doctorId = params.id;
    const selectedDate = new Date(dateStr);
    
    // Check doctor status
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: {
        schedules: true,
        doctorLeaves: true,
      },
    });

    if (!doctor || doctor.status !== 'ACTIVE') {
      return NextResponse.json({
        availableSlots: [],
        isAvailable: false,
        reason: 'Doctor is currently unavailable or inactive.',
      });
    }

    // Check if date falls on a doctor leave
    const onLeave = doctor.doctorLeaves.some((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return selectedDate >= start && selectedDate <= end;
    });

    if (onLeave) {
      return NextResponse.json({
        availableSlots: [],
        isAvailable: false,
        reason: 'Doctor is on scheduled leave/holiday on this date.',
      });
    }

    // Determine day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[selectedDate.getDay()];

    const daySchedule = doctor.schedules.find((s) => s.dayOfWeek.toLowerCase() === dayName.toLowerCase());

    if (!daySchedule || !daySchedule.isAvailable) {
      return NextResponse.json({
        availableSlots: [],
        isAvailable: false,
        reason: `Doctor does not have consultation hours on ${dayName}s.`,
      });
    }

    // Generate time slots (e.g. 09:00 AM to 05:00 PM with 30m slots)
    const baseSlots = [
      '09:00 AM - 09:30 AM',
      '09:30 AM - 10:00 AM',
      '10:00 AM - 10:30 AM',
      '10:30 AM - 11:00 AM',
      '11:00 AM - 11:30 AM',
      '11:30 AM - 12:00 PM',
      '02:00 PM - 02:30 PM',
      '02:30 PM - 03:00 PM',
      '03:00 PM - 03:30 PM',
      '03:30 PM - 04:00 PM',
      '04:00 PM - 04:30 PM',
      '04:30 PM - 05:00 PM',
    ];

    // Query existing booked appointments for this doctor on date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { timeSlot: true },
    });

    const bookedSlotsSet = new Set(bookedAppointments.map((a) => a.timeSlot));

    // Filter available slots
    const availableSlots = baseSlots.map((slot) => ({
      slot,
      isBooked: bookedSlotsSet.has(slot),
    }));

    return NextResponse.json({
      doctorId,
      doctorName: doctor.qualification,
      dayName,
      date: dateStr,
      isAvailable: true,
      availableSlots,
    });
  } catch (error) {
    console.error('Fetch doctor slots error:', error);
    return NextResponse.json({ error: 'Failed to calculate time slots' }, { status: 500 });
  }
}
