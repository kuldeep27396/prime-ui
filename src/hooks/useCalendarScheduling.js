import { useState } from 'react';
import { calendarService } from '../services/calendarService';
import { emailService } from '../services/emailService';

export const useCalendarScheduling = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const scheduleMeeting = async (meetingData) => {
        setLoading(true);
        setError(null);

        try {
            // First schedule the interview
            const event = await calendarService.scheduleInterview({
                candidateEmail: meetingData.attendees[0], // First attendee is candidate
                interviewerEmail: meetingData.attendees[1], // Second attendee is interviewer
                duration: meetingData.duration,
                preferredTimes: [{
                    start_time: meetingData.startTime,
                    end_time: new Date(new Date(meetingData.startTime).getTime() + meetingData.duration * 60000).toISOString()
                }]
            });

            // Send email invitations to all attendees using EmailJS
            const emailPromises = meetingData.attendees.map(email =>
                emailService.sendMeetingInvitation({
                    to_email: email,
                    to_name: email.split('@')[0], // Simple name extraction from email
                    meeting_title: meetingData.title,
                    meeting_date: new Date(meetingData.startTime).toLocaleDateString(),
                    meeting_time: new Date(meetingData.startTime).toLocaleTimeString(),
                    meeting_duration: `${meetingData.duration} minutes`,
                    meeting_description: meetingData.description,
                    meeting_link: event.meeting_url || '',
                })
            );

            await Promise.all(emailPromises);

            return event;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        scheduleMeeting,
        loading,
        error
    };
};