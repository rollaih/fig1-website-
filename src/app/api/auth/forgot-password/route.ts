import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await AdminUser.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });
    
    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    // Save reset token to user
    await AdminUser.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry
    });
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.name
    );
    
    if (!emailSent) {
      console.error('Failed to send password reset email to:', user.email);
      return NextResponse.json(
        { success: false, error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}