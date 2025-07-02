import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, brand, vision } = await request.json();
    
    // Validate required fields
    if (!name || !email || !brand || !vision) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Send notification email to admin
    const emailSent = await sendContactFormNotification({
      name: name.trim(),
      email: email.trim(),
      brand: brand.trim(),
      vision: vision.trim()
    });
    
    if (!emailSent) {
      console.error('Failed to send contact form notification');
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}