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
            // Use the backend URL from environment or default to localhost:8000
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/api/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: to_email, // Use actual recipient email
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