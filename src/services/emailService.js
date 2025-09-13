import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailService = {
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
            const response = await emailjs.send(
                EMAIL_SERVICE_ID,
                EMAIL_TEMPLATE_ID,
                {
                    to_email,
                    to_name,
                    meeting_title,
                    meeting_date,
                    meeting_time,
                    meeting_duration,
                    meeting_description,
                    meeting_link,
                },
                EMAIL_PUBLIC_KEY
            );

            return response.status === 200;
        } catch (error) {
            console.error('Failed to send email:', error);
            throw new Error('Failed to send meeting invitation');
        }
    },

    // Initialize EmailJS (call this when your app starts)
    init() {
        emailjs.init(EMAIL_PUBLIC_KEY);
    },
};