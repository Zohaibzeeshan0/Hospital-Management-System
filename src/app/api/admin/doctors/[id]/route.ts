import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, consultationFee, specialization, qualification, bio } = body;

    const updatedProfile = await prisma.doctorProfile.update({
      where: { id },
      data: {
        ...(status && { status: status as string }),
        ...(consultationFee !== undefined && { consultationFee: Number(consultationFee) }),
        ...(specialization && { specialization }),
        ...(qualification && { qualification }),
        ...(bio !== undefined && { bio }),
      },
      include: {
        user: true,
        department: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_DOCTOR',
        module: 'Doctor Management',
        details: `Admin updated doctor profile for ID ${id} - Status: ${status || 'unchanged'}`,
      },
    });

    return NextResponse.json({ doctor: updatedProfile });
  } catch (error) {
    console.error('Update doctor error:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const { status } = await req.json();

    if (!status || !['ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'].includes(status)) {
      return NextResponse.json({ error: 'Invalid doctor status' }, { status: 400 });
    }

    const updatedProfile = await prisma.doctorProfile.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_DOCTOR_STATUS',
        module: 'Doctor Management',
        details: `Admin changed doctor status for Dr. ${updatedProfile.user.name} to ${status}`,
      },
    });

    return NextResponse.json({ doctor: updatedProfile });
  } catch (error) {
    console.error('Patch doctor status error:', error);
    return NextResponse.json({ error: 'Failed to update doctor status' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const doctorProfile = await prisma.doctorProfile.findUnique({ where: { id } });

    if (!doctorProfile) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: doctorProfile.userId } });

    return NextResponse.json({ message: 'Doctor account deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
