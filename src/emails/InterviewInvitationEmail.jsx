import React from 'react';
import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Button,
  Heading,
  Hr,
} from '@react-email/components';

export const InterviewInvitationEmail = ({
  to_name = 'Candidate',
  meeting_title = 'Technical Interview',
  meeting_date = 'TBD',
  meeting_time = 'TBD',
  meeting_duration = '60 minutes',
  meeting_description = 'Technical interview session',
  meeting_link = '#'
}) => {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>🎯 Interview Invitation</Heading>
            <Text style={headerSubtitle}>
              You're invited to join an AI-powered technical interview
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hello <strong>{to_name}</strong>,</Text>

            <Text style={paragraph}>
              You have been invited to participate in a technical interview session.
              Please find the details below:
            </Text>

            {/* Meeting Details Card */}
            <Section style={meetingCard}>
              <Heading as="h3" style={cardTitle}>📋 Interview Details</Heading>
              <Text style={detailItem}><strong>Title:</strong> {meeting_title}</Text>
              <Text style={detailItem}><strong>Date:</strong> {meeting_date}</Text>
              <Text style={detailItem}><strong>Time:</strong> {meeting_time}</Text>
              <Text style={detailItem}><strong>Duration:</strong> {meeting_duration}</Text>
              <Text style={detailItem}><strong>Description:</strong> {meeting_description}</Text>
            </Section>

            <Text style={paragraph}>Click the button below to join the interview room:</Text>

            <Section style={buttonContainer}>
              <Button style={joinButton} href={meeting_link}>
                🚀 Join Interview Room
              </Button>
            </Section>

            <Text style={paragraph}><strong>Preparation Tips:</strong></Text>
            <Section style={tipsList}>
              <Text style={tipItem}>• Test your camera and microphone beforehand</Text>
              <Text style={tipItem}>• Ensure a stable internet connection</Text>
              <Text style={tipItem}>• Find a quiet, well-lit space</Text>
              <Text style={tipItem}>• Have a notepad and pen ready</Text>
            </Section>

            <Text style={paragraph}>
              If you have any questions or need to reschedule, please contact us immediately.
            </Text>

            <Text style={paragraph}>Good luck with your interview!</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Powered by <strong>Prime Interviews</strong> - AI-Powered Technical Interview Practice
            </Text>
            <Text style={footerText}>
              If you have any issues, please contact support at support@prime-interviews.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '30px',
  borderRadius: '10px 10px 0 0',
  textAlign: 'center',
  color: '#ffffff',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0',
  opacity: '0.9',
};

const content = {
  padding: '30px',
  backgroundColor: '#f9f9f9',
  borderRadius: '0 0 10px 10px',
};

const greeting = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '0 0 16px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '16px 0',
};

const meetingCard = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  borderLeft: '4px solid #667eea',
};

const cardTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333333',
  margin: '0 0 16px 0',
};

const detailItem = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#333333',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '32px 0',
};

const joinButton = {
  backgroundColor: '#667eea',
  borderRadius: '5px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '15px 30px',
  margin: '0',
};

const tipsList = {
  margin: '16px 0',
};

const tipItem = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#333333',
  margin: '4px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  textAlign: 'center',
  padding: '0 30px',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#666666',
  margin: '8px 0',
};

export default InterviewInvitationEmail;