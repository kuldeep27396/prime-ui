import React from 'react';
import { Container, Alert, Snackbar } from '@mui/material';
import { MeetingScheduler } from '../components/calendar/MeetingScheduler';
import { useCalendarScheduling } from '../hooks/useCalendarScheduling';

export const ScheduleMeetingPage = () => {
    const { scheduleMeeting, loading, error } = useCalendarScheduling();
    const [notification, setNotification] = React.useState('');

    const handleScheduleMeeting = async (meetingData) => {
        try {
            const result = await scheduleMeeting(meetingData);
            setNotification('Meeting scheduled successfully! Notifications sent to all attendees.');
        } catch (err) {
            setNotification(err.message);
        }
    };

    return (
        <Container>
            <MeetingScheduler
                onSchedule={handleScheduleMeeting}
                disabled={loading}
            />

            <Snackbar
                open={!!notification}
                autoHideDuration={6000}
                onClose={() => setNotification('')}
            >
                <Alert
                    severity={error ? 'error' : 'success'}
                    onClose={() => setNotification('')}
                >
                    {notification}
                </Alert>
            </Snackbar>
        </Container>
    );
};