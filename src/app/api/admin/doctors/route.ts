import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');

    const doctors = await prisma.doctorProfile.findMany({
      where: {
        AND: [
          departmentId ? { departmentId } : {},
          status ? { status: status as string } : {},
          search
            ? {
                OR: [
                  { user: { name: { contains: search } } },
                  { user: { email: { contains: search } } },
                  { specialization: { contains: search } },
                  { licenseNo: { contains: search } },
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
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      qualification,
      licenseNo,
      specialization,
      departmentId,
      experienceYears,
      consultationFee,
      bio,
      address,
      avatarUrl,
    } = body;

    if (!name || !email || !password || !licenseNo || !departmentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const newDoctor = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
        role: 'DOCTOR',
        doctorProfile: {
          create: {
            qualification,
            licenseNo,
            specialization,
            departmentId,
            experienceYears: Number(experienceYears) || 5,
            consultationFee: Number(consultationFee) || 100,
            bio,
            address,
            status: 'ACTIVE',
          },
        },
      },
      include: {
        doctorProfile: {
          include: { department: true },
        },
      },
    });

    // Create default working schedules
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const day of days) {
      await prisma.schedule.create({
        data: {
          doctorId: newDoctor.doctorProfile!.id,
          dayOfWeek: day,
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          maxPatients: 15,
          isAvailable: true,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE_DOCTOR',
        module: 'Doctor Management',
        details: `Admin created doctor account for Dr. ${name} (${licenseNo})`,
      },
    });

    return NextResponse.json({ doctor: newDoctor }, { status: 201 });
  } catch (error) {
    console.error('Create doctor error:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
