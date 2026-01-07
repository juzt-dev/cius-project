import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Save to database
    const contact = await prisma.contact.create({
      data: validatedData,
    });

    // Send confirmation email
    await sendEmail({
      to: validatedData.email,
      subject: 'Thank you for contacting us',
      html: emailTemplates.contactConfirmation(validatedData.name),
    });

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully', id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }

    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
