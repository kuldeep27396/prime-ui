import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Video,
    Mic,
    MicOff,
    VideoOff,
    Clock,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Send,
    Loader2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AIInterviewRoom() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [stage, setStage] = useState('loading'); // loading, permissions, ready, interview, complete
    const [sessionInfo, setSessionInfo] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [error, setError] = useState(null);

    // Media
    const [mediaStream, setMediaStream] = useState(null);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const videoRef = useRef(null);

    // Timer
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        validateToken();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const validateToken = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/interview/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            const data = await response.json();

            if (!data.valid) {
                setError(data.expired ? 'This interview link has expired.' : 'Invalid interview link.');
                setStage('error');
                return;
            }

            setSessionInfo(data);
            setSessionId(data.session_id);
            setStage('permissions');

        } catch (err) {
            setError('Failed to validate interview link.');
            setStage('error');
        }
    };

    const requestMediaPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setStage('ready');
        } catch (err) {
            console.error('Media permission error:', err);
            // Continue without video if permissions denied
            setStage('ready');
        }
    };

    const startInterview = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/interview/${token}/start`, {
                method: 'POST'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to start interview');
            }

            const data = await response.json();
            setSessionId(data.session_id);
            setQuestions(data.questions);
            setTimeRemaining(data.time_limit_minutes * 60);

            // Start timer
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 0) {
                        clearInterval(timerRef.current);
                        handleComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setStage('interview');

        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim() || submitting) return;

        setSubmitting(true);

        try {
            const currentQuestion = questions[currentQuestionIndex];
            const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

            const response = await fetch(`${API_BASE_URL}/api/interview/${sessionId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_id: currentQuestion.id,
                    answer_text: answer,
                    time_taken_seconds: timeTaken
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit answer');
            }

            const data = await response.json();

            // Reset for next question
            setAnswer('');
            startTimeRef.current = Date.now();

            if (data.remaining_count > 0 && data.next_question) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // All questions answered
                handleComplete();
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        try {
            const response = await fetch(`${API_BASE_URL}/api/interview/${sessionId}/complete`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to complete interview');
            }

            const data = await response.json();
            setSessionInfo(prev => ({ ...prev, score: data.overall_score }));
            setStage('complete');

            // Stop media
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }

        } catch (err) {
            setError(err.message);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleVideo = () => {
        if (mediaStream) {
            mediaStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setVideoEnabled(!videoEnabled);
        }
    };

    const toggleAudio = () => {
        if (mediaStream) {
            mediaStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setAudioEnabled(!audioEnabled);
        }
    };

    // Error state
    if (stage === 'error') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Unable to Start Interview</h1>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // Loading state
    if (stage === 'loading') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p className="text-lg">Validating interview link...</p>
                </div>
            </div>
        );
    }

    // Permissions stage
    if (stage === 'permissions') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-lg text-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                        <Video className="w-10 h-10 text-indigo-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Camera & Microphone Access</h1>
                    <p className="text-slate-600 mb-6">
                        We need access to your camera and microphone for the AI interview.
                        Your video will be recorded for evaluation.
                    </p>

                    <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-slate-900 mb-2">Interview Details:</h3>
                        <ul className="space-y-2 text-slate-600">
                            <li><strong>Position:</strong> {sessionInfo?.job_title}</li>
                            <li><strong>Company:</strong> {sessionInfo?.company_name}</li>
                            <li><strong>Duration:</strong> ~{sessionInfo?.duration_minutes} minutes</li>
                            <li><strong>Questions:</strong> {sessionInfo?.question_count} questions</li>
                        </ul>
                    </div>

                    <button
                        onClick={requestMediaPermissions}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Allow Camera & Microphone
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // Ready stage
    if (stage === 'ready') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Video preview */}
                        <div className="bg-slate-800 rounded-2xl overflow-hidden aspect-video relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            {!mediaStream && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
                                    <VideoOff className="w-16 h-16 text-slate-500" />
                                </div>
                            )}

                            {/* Controls */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                                <button
                                    onClick={toggleVideo}
                                    className={`p-3 rounded-full ${videoEnabled ? 'bg-slate-600' : 'bg-red-500'} text-white`}
                                >
                                    {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={toggleAudio}
                                    className={`p-3 rounded-full ${audioEnabled ? 'bg-slate-600' : 'bg-red-500'} text-white`}
                                >
                                    {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-white rounded-2xl p-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-4">Ready to Begin?</h1>

                            <div className="space-y-4 mb-6">
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-slate-600">Take your time to think before answering</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-slate-600">Speak clearly into your microphone</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-slate-600">You can type or speak your answers</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-slate-600">Complete all questions to finish</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <p className="text-amber-800 text-sm">
                                    <strong>Note:</strong> Once you start, you cannot pause the interview.
                                    Make sure you have a stable internet connection.
                                </p>
                            </div>

                            <button
                                onClick={startInterview}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Start Interview
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Interview stage
    if (stage === 'interview') {
        const currentQuestion = questions[currentQuestionIndex];

        return (
            <div className="min-h-screen bg-slate-900 flex flex-col">
                {/* Header */}
                <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-white">
                                <span className="text-indigo-400">Question {currentQuestionIndex + 1}</span>
                                <span className="text-slate-500"> / {questions.length}</span>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-white'
                            }`}>
                            <Clock className="w-5 h-5" />
                            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6 h-full">
                        {/* Video preview (small) */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-800 rounded-xl overflow-hidden sticky top-6">
                                <div className="aspect-video relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 left-2 flex gap-1">
                                        <button
                                            onClick={toggleVideo}
                                            className={`p-2 rounded-lg ${videoEnabled ? 'bg-slate-600' : 'bg-red-500'} text-white`}
                                        >
                                            {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={toggleAudio}
                                            className={`p-2 rounded-lg ${audioEnabled ? 'bg-slate-600' : 'bg-red-500'} text-white`}
                                        >
                                            {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Question & Answer */}
                        <div className="lg:col-span-2 flex flex-col">
                            {/* Question */}
                            <div className="bg-slate-800 rounded-xl p-6 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        AI
                                    </div>
                                    <div>
                                        <p className="text-white text-lg leading-relaxed">
                                            {currentQuestion?.question}
                                        </p>
                                        <p className="text-slate-500 text-sm mt-2">
                                            Category: {currentQuestion?.category} • Time limit: {Math.floor(currentQuestion?.time_limit_seconds / 60)} min
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Answer input */}
                            <div className="flex-1 bg-slate-800 rounded-xl p-6 flex flex-col">
                                <label className="text-slate-400 text-sm mb-2">Your Answer</label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="flex-1 w-full bg-slate-700 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                                />

                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-slate-500 text-sm">
                                        {answer.length} characters
                                    </p>

                                    <button
                                        onClick={handleSubmitAnswer}
                                        disabled={!answer.trim() || submitting}
                                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next Question'}
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Complete stage
    if (stage === 'complete') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Interview Complete!</h1>
                    <p className="text-slate-600 mb-6">
                        Thank you for completing the AI interview for {sessionInfo?.job_title} at {sessionInfo?.company_name}.
                    </p>

                    <div className="bg-slate-50 rounded-lg p-4 mb-6">
                        <p className="text-slate-700">
                            The hiring team will review your responses and get back to you soon.
                            You may close this window now.
                        </p>
                    </div>

                    <button
                        onClick={() => window.close()}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
