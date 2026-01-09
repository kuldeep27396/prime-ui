import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import {
    Brain,
    Code,
    Server,
    Cloud,
    MessageSquare,
    Database,
    Play,
    Trophy,
    Clock,
    TrendingUp,
    ChevronRight,
    Zap,
    Star
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const MOCK_CATEGORIES = [
    {
        id: 'dsa',
        name: 'DSA',
        displayName: 'Data Structures & Algorithms',
        description: 'Arrays, Trees, Graphs, Dynamic Programming, and more',
        icon: Code,
        color: 'from-blue-500 to-indigo-600',
        topics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching', 'Recursion'],
        difficulty: ['easy', 'medium', 'hard']
    },
    {
        id: 'system_design',
        name: 'System Design',
        displayName: 'System Design',
        description: 'Design scalable systems and architectures',
        icon: Server,
        color: 'from-purple-500 to-pink-600',
        topics: ['URL Shortener', 'Chat System', 'News Feed', 'Rate Limiter', 'Video Streaming'],
        difficulty: ['medium', 'hard']
    },
    {
        id: 'behavioral',
        name: 'Behavioral',
        displayName: 'Behavioral Interview',
        description: 'STAR method, leadership, conflict resolution',
        icon: MessageSquare,
        color: 'from-green-500 to-teal-600',
        topics: ['Leadership', 'Conflict Resolution', 'Teamwork', 'Problem Solving', 'Career Goals'],
        difficulty: ['easy', 'medium']
    },
    {
        id: 'frontend',
        name: 'Frontend',
        displayName: 'Frontend Development',
        description: 'React, JavaScript, CSS, Web APIs',
        icon: Code,
        color: 'from-orange-500 to-red-600',
        topics: ['JavaScript', 'React', 'CSS & Layout', 'Performance', 'Accessibility'],
        difficulty: ['easy', 'medium', 'hard']
    },
    {
        id: 'backend',
        name: 'Backend',
        displayName: 'Backend Development',
        description: 'APIs, databases, microservices, caching',
        icon: Database,
        color: 'from-cyan-500 to-blue-600',
        topics: ['REST APIs', 'Databases', 'Caching', 'Authentication', 'Microservices'],
        difficulty: ['easy', 'medium', 'hard']
    },
    {
        id: 'devops',
        name: 'DevOps',
        displayName: 'DevOps & Cloud',
        description: 'CI/CD, Docker, Kubernetes, AWS/GCP',
        icon: Cloud,
        color: 'from-pink-500 to-rose-600',
        topics: ['Docker & Kubernetes', 'CI/CD Pipelines', 'AWS', 'Monitoring', 'Infrastructure'],
        difficulty: ['medium', 'hard']
    }
];

export default function MockInterviewPage() {
    const navigate = useNavigate();
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(5);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            fetchProgress();
        }
    }, [isSignedIn]);

    const fetchProgress = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/mock/history?limit=1`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                // Calculate progress per category
                // This would come from the API in a real implementation
            }
        } catch (err) {
            console.error('Error fetching progress:', err);
        }
    };

    const startInterview = async () => {
        if (!selectedCategory) return;

        setLoading(true);

        try {
            const token = await getToken();

            const res = await fetch(`${API_BASE_URL}/api/mock/start`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: selectedCategory.id,
                    topic: selectedTopic,
                    difficulty: selectedDifficulty,
                    question_count: questionCount
                })
            });

            if (!res.ok) throw new Error('Failed to start interview');

            const data = await res.json();
            navigate(`/mock/${data.session_id}`);

        } catch (err) {
            console.error('Error starting interview:', err);
            alert('Failed to start interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm mb-4">
                        <Brain className="w-4 h-4" />
                        AI Mock Interview
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Practice Makes Perfect
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Choose a category and let AI help you prepare for your next technical interview
                    </p>
                </div>

                {/* Quick Stats (if signed in) */}
                {isSignedIn && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                        <QuickStat icon={Trophy} label="Sessions" value="12" color="yellow" />
                        <QuickStat icon={Star} label="Best Score" value="94%" color="green" />
                        <QuickStat icon={Clock} label="Time Spent" value="4.2 hrs" color="blue" />
                        <QuickStat icon={TrendingUp} label="Improvement" value="+15%" color="purple" />
                    </div>
                )}

                {/* Category Selection */}
                {!selectedCategory ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_CATEGORIES.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onClick={() => setSelectedCategory(category)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Configuration Panel */
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            {/* Selected Category Header */}
                            <div className={`bg-gradient-to-r ${selectedCategory.color} p-6 text-white`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                        <selectedCategory.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedCategory.displayName}</h2>
                                        <p className="text-white/80">{selectedCategory.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Topic Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Focus Topic (Optional)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedTopic(null)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTopic === null
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            All Topics
                                        </button>
                                        {selectedCategory.topics.map((topic) => (
                                            <button
                                                key={topic}
                                                onClick={() => setSelectedTopic(topic)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTopic === topic
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Difficulty Level
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['easy', 'medium', 'hard'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setSelectedDifficulty(level)}
                                                disabled={!selectedCategory.difficulty.includes(level)}
                                                className={`py-3 rounded-lg font-medium capitalize transition-all ${selectedDifficulty === level
                                                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                                                        : selectedCategory.difficulty.includes(level)
                                                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Question Count */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Number of Questions
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="3"
                                            max="10"
                                            value={questionCount}
                                            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="w-8 text-center font-semibold text-indigo-600">{questionCount}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Estimated time: ~{questionCount * 3} minutes
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="flex-1 py-3 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={startInterview}
                                        disabled={loading || !isSignedIn}
                                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5" />
                                                Start Interview
                                            </>
                                        )}
                                    </button>
                                </div>

                                {!isSignedIn && (
                                    <p className="text-center text-sm text-slate-500">
                                        <a href="/sign-in" className="text-indigo-600 font-medium hover:underline">Sign in</a> to start practicing
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips Section */}
                <div className="mt-16">
                    <h3 className="text-xl font-bold text-slate-900 text-center mb-8">
                        Interview Tips
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <TipCard
                            icon={Zap}
                            title="Think Out Loud"
                            description="Verbalize your thought process. Interviewers want to see how you approach problems."
                        />
                        <TipCard
                            icon={Clock}
                            title="Manage Time"
                            description="Don't spend too long on one question. It's okay to provide a partial answer."
                        />
                        <TipCard
                            icon={Brain}
                            title="Practice Regularly"
                            description="Consistent practice is key. Aim for a few sessions per week."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickStat({ icon: Icon, label, value, color }) {
    const colors = {
        yellow: 'text-yellow-600 bg-yellow-100',
        green: 'text-green-600 bg-green-100',
        blue: 'text-blue-600 bg-blue-100',
        purple: 'text-purple-600 bg-purple-100'
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xl font-bold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                </div>
            </div>
        </div>
    );
}

function CategoryCard({ category, onClick }) {
    const Icon = category.icon;

    return (
        <button
            onClick={onClick}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-left hover:shadow-lg hover:border-indigo-200 transition-all"
        >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{category.displayName}</h3>
            <p className="text-slate-600 text-sm mb-4">{category.description}</p>
            <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
                Start Practicing
                <ChevronRight className="w-4 h-4" />
            </div>
        </button>
    );
}

function TipCard({ icon: Icon, title, description }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
            <p className="text-slate-600 text-sm">{description}</p>
        </div>
    );
}
