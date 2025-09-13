import React, { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { TextField, Button, Box, Typography, Chip, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const MeetingScheduler = ({ onSchedule }) => {
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(60);
    const [attendees, setAttendees] = useState([]);
    const [newAttendee, setNewAttendee] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddAttendee = () => {
        if (newAttendee && newAttendee.includes('@')) {
            setAttendees([...attendees, newAttendee]);
            setNewAttendee('');
        }
    };

    const handleRemoveAttendee = (email) => {
        setAttendees(attendees.filter((a) => a !== email));
    };

    const handleSchedule = () => {
        if (!startTime || !title || attendees.length === 0) return;

        const meetingData = {
            title,
            description,
            startTime: startTime.toISOString(),
            duration, // in minutes
            attendees,
        };

        onSchedule(meetingData);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Schedule Meeting
                </Typography>

                <Stack spacing={3}>
                    <TextField
                        label="Meeting Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                    />

                    <DateTimePicker
                        label="Start Time"
                        value={startTime}
                        onChange={setStartTime}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDateTime={new Date()}
                    />

                    <TextField
                        label="Duration (minutes)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        fullWidth
                        inputProps={{ min: 15, step: 15 }}
                    />

                    <Box>
                        <Stack direction="row" spacing={1} mb={1}>
                            <TextField
                                label="Add Attendee Email"
                                value={newAttendee}
                                onChange={(e) => setNewAttendee(e.target.value)}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddAttendee}
                                disabled={!newAttendee.includes('@')}
                            >
                                Add
                            </Button>
                        </Stack>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {attendees.map((email) => (
                                <Chip
                                    key={email}
                                    label={email}
                                    onDelete={() => handleRemoveAttendee(email)}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleSchedule}
                        disabled={!startTime || !title || attendees.length === 0}
                        fullWidth
                    >
                        Schedule Meeting
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};