import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, gender, dateOfBirth, bloodGroup, address, emergencyContact, emergencyPhone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const patientCode = `PAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || null,
        role: 'PATIENT',
        patientProfile: {
          create: {
            patientCode,
            gender: gender || 'Other',
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1995-01-01'),
            bloodGroup: bloodGroup || 'O+',
            address: address || '',
            emergencyContact: emergencyContact || '',
            emergencyPhone: emergencyPhone || '',
          },
        },
      },
      include: {
        patientProfile: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword,
    });

    response.cookies.set({
      name: 'medipulse_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to MediPulse HMS',
        message: 'Your patient account has been created successfully. You can now book appointments with our specialists.',
        type: 'SUCCESS',
      },
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create patient account' }, { status: 500 });
  }
}
