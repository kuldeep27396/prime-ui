import { render } from '@react-email/render';
import { InterviewInvitationEmail } from '../emails/InterviewInvitationEmail';

export const emailService = {
    // Send meeting invitation via backend API (using SMTP with React Email)
    async sendMeetingInvitation({
        to_email,
        to_name,
        meeting_title,
        meeting_date,
        meeting_time,
        meeting_duration,
        meeting_description,
        meeting_link,
    }) {
        try {
            // Generate HTML using React Email
            const emailHtml = await render(InterviewInvitationEmail({
                to_name,
                meeting_title,
                meeting_date,
                meeting_time,
                meeting_duration,
                meeting_description,
                meeting_link
            }));

            // Call backend API for SMTP email sending
            // NOTE: For testing with Resend free tier, we're using the verified owner email
            // In production, you would use the actual recipient email after domain verification
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'kuldeep.pal.eng@gmail.com', // Using verified email for Resend free tier
                    toName: to_name,
                    subject: `Interview Invitation: ${meeting_title}`,
                    html: emailHtml
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Email sent successfully via SMTP with React Email');
            return result.success;
        } catch (error) {
            console.error('❌ Failed to send email via SMTP:', error);
            throw new Error(`Failed to send meeting invitation: ${error.message}`);
        }
    },

    // Initialize email service
    init() {
        console.log('📧 Email service configured with SMTP + React Email');
    },
};