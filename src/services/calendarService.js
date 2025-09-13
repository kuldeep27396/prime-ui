import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

export const calendarService = {
    async scheduleInterview({
        candidateEmail,
        interviewerEmail,
        duration,
        preferredTimes = null,
    }) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/integrations/calendar/schedule-interview`,
                {
                    candidate_email: candidateEmail,
                    interviewer_email: interviewerEmail,
                    duration_minutes: duration,
                    preferred_times: preferredTimes,
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to schedule interview');
        }
    },

    async sendNotification({ recipient, templateId, variables }) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/integrations/communication/send-notification`,
                {
                    recipient,
                    template_id: templateId,
                    variables,
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to send notification');
        }
    },
};