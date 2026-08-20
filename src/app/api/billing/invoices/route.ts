import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let invoices: any[] = [];
    if (user.role === 'ADMIN') {
      invoices = await prisma.invoice.findMany({
        include: {
          patient: { include: { user: true } },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (user.patientProfile) {
      invoices = await prisma.invoice.findMany({
        where: { patientId: user.patientProfile.id },
        include: { payments: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      invoices = [];
    }

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Fetch invoices error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId, paymentMethod, amount } = await req.json();

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const payAmount = Number(amount) || invoice.totalAmount;
    const txnId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: payAmount,
        paymentMethod: paymentMethod || 'Credit Card',
        transactionId: txnId,
        status: 'COMPLETED',
      },
    });

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: invoice.paidAmount + payAmount,
        status: 'PAID',
      },
    });

    if (invoice.appointmentId) {
      await prisma.appointment.update({
        where: { id: invoice.appointmentId },
        data: { paymentStatus: 'PAID' },
      });
    }

    return NextResponse.json({ invoice: updatedInvoice, payment });
  } catch (error) {
    console.error('Process payment error:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
