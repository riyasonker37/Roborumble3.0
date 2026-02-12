import * as nodemailer from "nodemailer";

// Email configuration - TEMPORARY HARDCODED FIX for hosting
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "roborumble@csjmu.ac.in",
        pass: "opgywemuyiythmuo",
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        const user = "roborumble@csjmu.ac.in";
        const pass = "opgywemuyiythmuo";

        // Check if SMTP is configured
        if (!user || !pass) {
            console.log("Email not configured - skipping send to:", options.to);
            console.log("Subject:", options.subject);
            return true; // Return true to not block the flow
        }

        await transporter.sendMail({
            from: `"Robo Rumble" <${user}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        console.log("Email sent to:", options.to);
        return true;
    } catch (error) {
        console.error("Email send error:", error);
        return false;
    }
}

export async function sendPaymentVerifiedEmail(
    to: string,
    leaderName: string,
    events: string[],
    amount: number
) {
    const eventList = events.map((e) => `<li>${e}</li>`).join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #00F0FF33; border-radius: 16px; padding: 32px; }
            .header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; color: #00F0FF; font-family: monospace; }
            .success { color: #22c55e; font-size: 18px; font-weight: bold; margin: 20px 0; }
            .events { background: #000; padding: 16px; border-radius: 8px; margin: 16px 0; }
            .events ul { margin: 0; padding-left: 20px; }
            .events li { color: #00F0FF; margin: 8px 0; }
            .amount { font-size: 32px; font-weight: 900; color: #00F0FF; text-align: center; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #333; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ROBO_RUMBLE</div>
            </div>
            <p>Hi ${leaderName},</p>
            <div class="success">✓ Your payment has been verified!</div>
            <p>You are now registered for the following events:</p>
            <div class="events">
                <ul>${eventList}</ul>
            </div>
            <div class="amount">₹${amount} PAID</div>
            <p>Your QR code is available in your dashboard. See you at the event!</p>
            <div class="footer">
                <p>Robo Rumble 3.0 | Robotics Championship</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return sendEmail({
        to,
        subject: "✅ Payment Verified - Robo Rumble Registration Confirmed!",
        html,
    });
}

export async function sendPaymentRejectedEmail(
    to: string,
    leaderName: string,
    reason: string,
    amount: number
) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #ff003c33; border-radius: 16px; padding: 32px; }
            .header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; color: #FF003C; font-family: monospace; }
            .error { color: #ef4444; font-size: 18px; font-weight: bold; margin: 20px 0; }
            .reason { background: #ff003c11; border: 1px solid #ff003c33; padding: 16px; border-radius: 8px; margin: 16px 0; color: #ff6b6b; }
            .amount { font-size: 24px; font-weight: 900; color: #666; text-align: center; margin: 20px 0; text-decoration: line-through; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #333; }
            .cta { display: inline-block; background: #00F0FF; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ROBO_RUMBLE</div>
            </div>
            <p>Hi ${leaderName},</p>
            <div class="error">✗ Your payment could not be verified</div>
            <p>Unfortunately, we were unable to verify your payment submission.</p>
            <div class="reason">
                <strong>Reason:</strong> ${reason}
            </div>
            <div class="amount">₹${amount}</div>
            <p>Please try again with a valid payment proof. Make sure:</p>
            <ul>
                <li>The transaction ID is correct</li>
                <li>The screenshot clearly shows the payment details</li>
                <li>The amount matches the registration total</li>
            </ul>
            <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://roborumble.org'}/dashboard/events" class="cta">Try Again</a>
            </p>
            <div class="footer">
                <p>Need help? Contact us at support@roborumble.org</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return sendEmail({
        to,
        subject: "❌ Payment Rejected - Robo Rumble Registration",
        html,
    });
}
// @ts-ignore - module resolves at build time but IDE may not find type declarations
import { render } from '@react-email/render';
import { RegistrationApprovedEmail } from '@/app/emails/RegistrationApproved';

export async function sendApprovalEmails(
    eventDetails: { name: string, fees: number, brochureLink?: string },
    participants: { name: string, email: string, transactionId: string }[]
) {
    try {
        const user = "roborumble@csjmu.ac.in";
        const pass = "opgywemuyiythmuo";

        if (!user || !pass) {
            console.log("SMTP not configured - skipping approval emails");
            return { success: true };
        }

        const results = await Promise.all(participants.map(async (userItem) => {
            try {
                const htmlContent = await render(RegistrationApprovedEmail({
                    userName: userItem.name,
                    eventName: eventDetails.name,
                    transactionId: userItem.transactionId,
                    amount: `₹${eventDetails.fees}`,
                    brochureUrl: eventDetails.brochureLink || 'https://roborumble.org/events',
                }));

                await transporter.sendMail({
                    from: `"Robo Rumble Team" <${user}>`,
                    to: userItem.email,
                    subject: `Approved: ${eventDetails.name} Registration 🤖`,
                    html: htmlContent,
                });

                console.log(`Approval email sent to: ${userItem.email}`);
                return { email: userItem.email, success: true };
            } catch (err) {
                console.error(`Failed to send email to ${userItem.email}:`, err);
                return { email: userItem.email, success: false, error: err };
            }
        }));

        return { success: true, results };
    } catch (error) {
        console.error("sendApprovalEmails general error:", error);
        return { success: false, error };
    }
}
