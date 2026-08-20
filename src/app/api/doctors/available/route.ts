import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');
    const search = searchParams.get('search') || '';

    const doctors = await prisma.doctorProfile.findMany({
      where: {
        status: 'ACTIVE',
        AND: [
          departmentId ? { departmentId } : {},
          search
            ? {
                OR: [
                  { user: { name: { contains: search } } },
                  { specialization: { contains: search } },
                  { department: { name: { contains: search } } },
                ],
              }
            : {},
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            status: true,
          },
        },
        department: true,
        schedules: true,
        doctorLeaves: {
          where: { endDate: { gte: new Date() } },
        },
      },
      orderBy: { rating: 'desc' },
    });

    const formatted = doctors.map((doc) => ({
      id: doc.id,
      userId: doc.userId,
      name: doc.user.name,
      email: doc.user.email,
      phone: doc.user.phone,
      avatarUrl: doc.user.avatarUrl,
      qualification: doc.qualification,
      licenseNo: doc.licenseNo,
      specialization: doc.specialization,
      departmentId: doc.departmentId,
      departmentName: doc.department?.name,
      experienceYears: doc.experienceYears,
      consultationFee: doc.consultationFee,
      bio: doc.bio,
      rating: doc.rating,
      status: doc.status,
      schedules: doc.schedules,
      doctorLeaves: doc.doctorLeaves,
    }));

    return NextResponse.json({ doctors: formatted });
  } catch (error) {
    console.error('Fetch available doctors error:', error);
    return NextResponse.json({ error: 'Failed to fetch available doctors' }, { status: 500 });
  }
}
