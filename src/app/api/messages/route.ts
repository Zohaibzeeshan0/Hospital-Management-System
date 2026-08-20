import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let messages;
    if (user.role === 'ADMIN') {
      messages = await prisma.message.findMany({
        include: {
          sender: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
          recipient: { select: { id: true, name: true, email: true } },
          replies: {
            include: {
              sender: { select: { name: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id },
            { recipientId: user.id },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
          recipient: { select: { id: true, name: true, email: true } },
          replies: {
            include: {
              sender: { select: { name: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message, replyToId, recipientId } = await req.json();

    if (!message || (!subject && !replyToId)) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: user.id,
        recipientId: recipientId || null,
        subject: subject || 'Reply Inquiry',
        message,
        replyToId: replyToId || null,
        status: 'UNREAD',
      },
      include: {
        sender: { select: { name: true, email: true } },
      },
    });

    // Notify Admin users if sent by Patient
    if (user.role === 'PATIENT') {
      const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'New Patient Message',
            message: `Patient ${user.name} sent a message: "${subject || 'General Inquiry'}"`,
            type: 'INFO',
          },
        });
      }
    } else if (recipientId) {
      // Notify Patient if Admin replied
      await prisma.notification.create({
        data: {
          userId: recipientId,
          title: 'Hospital Support Reply',
          message: `Admin replied to your message: "${subject || 'Hospital Inquiry'}"`,
          type: 'INFO',
        },
      });
    }

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
