import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const totalPatients = await prisma.patientProfile.count();
    const totalDoctors = await prisma.doctorProfile.count();
    const totalAppointments = await prisma.appointment.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: today,
        },
      },
    });

    const pendingAppointments = await prisma.appointment.count({
      where: { status: 'PENDING' },
    });

    const completedAppointments = await prisma.appointment.count({
      where: { status: 'COMPLETED' },
    });

    const cancelledAppointments = await prisma.appointment.count({
      where: { status: 'CANCELLED' },
    });

    const totalDepartments = await prisma.department.count();

    // Financial calculations
    const paidInvoices = await prisma.invoice.aggregate({
      _sum: { paidAmount: true },
    });

    const pendingInvoices = await prisma.invoice.aggregate({
      where: { status: 'UNPAID' },
      _sum: { totalAmount: true },
    });

    const revenue = paidInvoices._sum.paidAmount || 0;
    const pendingPayments = pendingInvoices._sum.totalAmount || 0;

    // Chart data aggregates
    const departmentDistribution = await prisma.department.findMany({
      select: {
        name: true,
        _count: {
          select: { doctors: true, appointments: true },
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todaysAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        totalDepartments,
        revenue,
        pendingPayments,
        availableBeds: 42,
        emergencyCases: 3,
      },
      departmentDistribution: departmentDistribution.map((d) => ({
        name: d.name,
        doctors: d._count.doctors,
        appointments: d._count.appointments,
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
