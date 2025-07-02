import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: 'forgot-password' | 'contact-form' | 'admin-welcome';
  templateData?: Record<string, any>;
}

// Email templates
const templates = {
  'forgot-password': {
    subject: 'Reset Your Fig1 Admin Password',
    html: (data: { resetLink: string; adminName: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://fig1.com/Fig1_Finallogo.png" alt="Fig1 Logo" style="height: 50px;">
          </div>
          
          <h1 style="color: #D959B3; text-align: center; margin-bottom: 30px;">Reset Your Password</h1>
          
          <p>Hi ${data.adminName},</p>
          
          <p>You requested to reset your password for your Fig1 admin account. Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" 
               style="background-color: #D959B3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 500;">
              Reset Password
            </a>
          </div>
          
          <p>This link will expire in 1 hour for security reasons.</p>
          
          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            This email was sent by Fig1 Admin System<br>
            If you have any questions, contact us at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>
          </p>
        </body>
      </html>
    `,
    text: (data: { resetLink: string; adminName: string }) => `
      Hi ${data.adminName},
      
      You requested to reset your password for your Fig1 admin account.
      
      Click this link to reset your password: ${data.resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      Fig1 Team
    `
  },
  
  'contact-form': {
    subject: 'New Contact Form Submission - Fig1',
    html: (data: { name: string; email: string; brand: string; vision: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://fig1.com/Fig1_Finallogo.png" alt="Fig1 Logo" style="height: 50px;">
          </div>
          
          <h1 style="color: #D959B3; text-align: center; margin-bottom: 30px;">New Contact Form Submission</h1>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #D959B3;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Brand:</strong> ${data.brand}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h3 style="margin-top: 0; color: #D959B3;">Vision</h3>
            <p style="white-space: pre-wrap;">${data.vision}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            This email was sent from the Fig1 contact form on ${new Date().toLocaleString()}
          </p>
        </body>
      </html>
    `,
    text: (data: { name: string; email: string; brand: string; vision: string }) => `
      New Contact Form Submission
      
      Name: ${data.name}
      Email: ${data.email}
      Brand: ${data.brand}
      
      Vision:
      ${data.vision}
      
      Submitted: ${new Date().toLocaleString()}
    `
  },
  
  'admin-welcome': {
    subject: 'Welcome to Fig1 Admin Panel',
    html: (data: { adminName: string; email: string; loginUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Fig1 Admin</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://fig1.com/Fig1_Finallogo.png" alt="Fig1 Logo" style="height: 50px;">
          </div>
          
          <h1 style="color: #D959B3; text-align: center; margin-bottom: 30px;">Welcome to Fig1 Admin!</h1>
          
          <p>Hi ${data.adminName},</p>
          
          <p>Your admin account has been created successfully. You can now access the Fig1 admin panel to manage blog posts, media, and other content.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #D959B3;">Your Account Details</h3>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Role:</strong> Admin</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" 
               style="background-color: #D959B3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 500;">
              Access Admin Panel
            </a>
          </div>
          
          <p>If you have any questions or need help getting started, don't hesitate to reach out.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            Welcome to the team!<br>
            Fig1 Admin System
          </p>
        </body>
      </html>
    `,
    text: (data: { adminName: string; email: string; loginUrl: string }) => `
      Welcome to Fig1 Admin!
      
      Hi ${data.adminName},
      
      Your admin account has been created successfully.
      
      Account Details:
      Email: ${data.email}
      Role: Admin
      
      Access the admin panel: ${data.loginUrl}
      
      Welcome to the team!
      Fig1 Admin System
    `
  }
};

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return false;
    }

    let subject = options.subject;
    let html = options.html;
    let text = options.text;

    // Use template if specified
    if (options.template && options.templateData) {
      const template = templates[options.template];
      if (template) {
        subject = template.subject;
        html = template.html(options.templateData);
        text = template.text(options.templateData);
      }
    }

    const msg = {
      to: options.to,
      from: {
        email: process.env.FROM_EMAIL || 'noreply@fig1.com',
        name: 'Fig1'
      },
      subject,
      text,
      html
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Utility functions for common email scenarios
export async function sendPasswordResetEmail(email: string, resetToken: string, adminName: string): Promise<boolean> {
  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your Fig1 Admin Password',
    template: 'forgot-password',
    templateData: {
      resetLink,
      adminName
    }
  });
}

export async function sendContactFormNotification(formData: {
  name: string;
  email: string;
  brand: string;
  vision: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'rolla@fig1.com';
  
  return sendEmail({
    to: adminEmail,
    subject: `New Contact Form: ${formData.name} from ${formData.brand}`,
    template: 'contact-form',
    templateData: formData
  });
}

export async function sendWelcomeEmail(email: string, adminName: string): Promise<boolean> {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/login`;
  
  return sendEmail({
    to: email,
    subject: 'Welcome to Fig1 Admin Panel',
    template: 'admin-welcome',
    templateData: {
      adminName,
      email,
      loginUrl
    }
  });
}