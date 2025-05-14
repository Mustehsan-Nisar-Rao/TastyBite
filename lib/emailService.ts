// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_SERVER_HOST,
//   port: Number(process.env.EMAIL_SERVER_PORT),
//   secure: process.env.NODE_ENV === 'production',
//   auth: {
//     user: process.env.EMAIL_SERVER_USER,
//     pass: process.env.EMAIL_SERVER_PASSWORD,
//   },
// });

// export const sendOTPEmail = async (email: string, otp: string) => {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject: 'Email Verification - TastyBites',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #e67e22;">TastyBites Email Verification</h2>
//         <p>Thank you for registering with TastyBites! Please use the following OTP to verify your email address:</p>
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
//           <h1 style="color: #e67e22; letter-spacing: 5px; margin: 0;">${otp}</h1>
//         </div>
//         <p>This OTP will expire in 10 minutes.</p>
//         <p>If you didn't request this verification, please ignore this email.</p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send OTP email');
//   }
// }; 

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: 'mustehsannisarrao@gmail.com',
    pass: 'psze puph jhkr ypla'
  },
  tls: {
    rejectUnauthorized: true
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: '"TastyBites" <mustehsannisarrao@gmail.com>',
    to: email,
    subject: 'Email Verification - TastyBites',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e67e22;">TastyBites Email Verification</h2>
        <p>Thank you for registering with TastyBites! Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h1 style="color: #e67e22; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error: any) {
    console.error('SMTP Error:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};
