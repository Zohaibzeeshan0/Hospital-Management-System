import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    const reviews = await prisma.review.findMany({
      where: {
        ...(doctorId ? { doctorId } : {}),
        status: 'APPROVED',
      },
      include: {
        patientUser: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { doctorId, appointmentId, rating, comment } = await req.json();

    // Verify patient has a completed appointment with this doctor
    const review = await prisma.review.create({
      data: {
        patientUserId: user.id,
        doctorId,
        appointmentId,
        rating: Number(rating),
        comment,
        status: 'APPROVED',
      },
    });

    // Update doctor average rating
    const allReviews = await prisma.review.findMany({ where: { doctorId } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.doctorProfile.update({
      where: { id: doctorId },
      data: { rating: Number(avg.toFixed(1)) },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}
