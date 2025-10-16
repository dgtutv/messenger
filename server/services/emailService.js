const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_API_KEY);

// Generate random 6-digit code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
async function sendVerificationEmail(email, name, code) {
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL, // Add this to your .env
        subject: 'Verify Your Email - Messenger App',
        text: `Hi ${name}, Your verification code is: ${code}. This code will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Messenger App!</h2>
                <p>Hi ${name},</p>
                <p>Thank you for registering. Please use the verification code below to verify your email address:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${code}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't create this account, please ignore this email.</p>
                <p>Best regards,<br>Messenger Team</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent to:', email);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SendGrid error:', error.response.body);
        }
        return { success: false, error: error.message };
    }
}

module.exports = {
    generateVerificationCode,
    sendVerificationEmail
};
