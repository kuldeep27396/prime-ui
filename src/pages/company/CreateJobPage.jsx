import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
    Briefcase,
    MapPin,
    Clock,
    Users,
    DollarSign,
    ChevronLeft,
    Save,
    Eye,
    Plus,
    Trash2,
    Sparkles
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const JOB_TYPES = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
];

const DIFFICULTY_LEVELS = [
    { value: 'easy', label: 'Easy', description: 'Entry level, basic questions' },
    { value: 'medium', label: 'Medium', description: 'Mid-level, moderate complexity' },
    { value: 'hard', label: 'Hard', description: 'Senior level, challenging questions' }
];

export default function CreateJobPage() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState(null);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        skills_required: [],
        experience_min: 0,
        experience_max: 5,
        location: '',
        job_type: 'full_time',
        department: '',
        salary_min: null,
        salary_max: null,
        status: 'active',
        is_public: true,
        application_deadline: '',
        // AI Interview Settings
        question_count: 5,
        interview_duration: 15,
        difficulty_level: 'medium',
        passing_score: 60,
        ai_questions: []
    });

    const [skillInput, setSkillInput] = useState('');
    const [customQuestion, setCustomQuestion] = useState('');

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/companies/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                navigate('/company/onboarding');
                return;
            }

            const company = await res.json();
            setCompanyId(company.id);
        } catch (err) {
            console.error('Error fetching company:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills_required.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills_required: [...prev.skills_required, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills_required: prev.skills_required.filter(s => s !== skill)
        }));
    };

    const addCustomQuestion = () => {
        if (customQuestion.trim()) {
            setFormData(prev => ({
                ...prev,
                ai_questions: [...prev.ai_questions, { question: customQuestion.trim(), category: 'custom' }]
            }));
            setCustomQuestion('');
        }
    };

    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            ai_questions: prev.ai_questions.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken();

            const payload = {
                ...formData,
                experience_min: parseInt(formData.experience_min),
                experience_max: parseInt(formData.experience_max),
                salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
                question_count: parseInt(formData.question_count),
                interview_duration: parseInt(formData.interview_duration),
                passing_score: parseInt(formData.passing_score),
                application_deadline: formData.application_deadline || null
            };

            const res = await fetch(`${API_BASE_URL}/api/companies/${companyId}/jobs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Failed to create job');
            }

            const data = await res.json();
            navigate(`/company/jobs/${data.job.id}`);

        } catch (err) {
            console.error('Error creating job:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/company/jobs')}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create Job Posting</h1>
                        <p className="text-slate-600">Set up your job and AI interview settings</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <button
                                onClick={() => setStep(s)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s === step ? 'bg-indigo-600 text-white' :
                                        s < step ? 'bg-green-500 text-white' :
                                            'bg-slate-200 text-slate-500'
                                    }`}
                            >
                                {s}
                            </button>
                            {s < 3 && (
                                <div className={`w-16 h-1 mx-2 rounded ${s < step ? 'bg-green-500' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">Job Details</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Senior Software Engineer"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Job Type
                                        </label>
                                        <select
                                            name="job_type"
                                            value={formData.job_type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {JOB_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g., San Francisco, CA or Remote"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Requirements
                                    </label>
                                    <textarea
                                        name="requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="List the requirements for this position..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Required Skills
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                            placeholder="Type a skill and press Enter"
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills_required.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                                            >
                                                {skill}
                                                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-indigo-900">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Experience (Years)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="experience_min"
                                                value={formData.experience_min}
                                                onChange={handleChange}
                                                min="0"
                                                className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <span className="text-slate-500">to</span>
                                            <input
                                                type="number"
                                                name="experience_max"
                                                value={formData.experience_max}
                                                onChange={handleChange}
                                                min="0"
                                                className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <span className="text-slate-500">years</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            placeholder="e.g., Engineering"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700"
                                >
                                    Next: AI Settings
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: AI Interview Settings */}
                    {step === 2 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">AI Interview Settings</h2>
                                    <p className="text-slate-500 text-sm">Configure how AI screens your candidates</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Number of Questions
                                        </label>
                                        <select
                                            name="question_count"
                                            value={formData.question_count}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {[3, 5, 7, 10].map(n => (
                                                <option key={n} value={n}>{n} questions</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Interview Duration
                                        </label>
                                        <select
                                            name="interview_duration"
                                            value={formData.interview_duration}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {[10, 15, 20, 30, 45].map(n => (
                                                <option key={n} value={n}>{n} minutes</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Difficulty Level
                                    </label>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {DIFFICULTY_LEVELS.map(level => (
                                            <button
                                                key={level.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, difficulty_level: level.value }))}
                                                className={`p-4 rounded-lg border-2 text-left transition-all ${formData.difficulty_level === level.value
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="font-semibold text-slate-900">{level.label}</div>
                                                <div className="text-sm text-slate-500">{level.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Passing Score (%)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            name="passing_score"
                                            value={formData.passing_score}
                                            onChange={handleChange}
                                            min="40"
                                            max="90"
                                            step="5"
                                            className="flex-1"
                                        />
                                        <span className="w-16 text-center font-semibold text-indigo-600">
                                            {formData.passing_score}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Candidates scoring above this will be auto-shortlisted
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Custom Questions (Optional)
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={customQuestion}
                                            onChange={(e) => setCustomQuestion(e.target.value)}
                                            placeholder="Add a custom interview question..."
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addCustomQuestion}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {formData.ai_questions.length > 0 && (
                                        <div className="space-y-2">
                                            {formData.ai_questions.map((q, i) => (
                                                <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                                                    <span className="flex-1 text-slate-700">{q.question}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(i)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-sm text-slate-500 mt-2">
                                        Leave empty to let AI generate questions based on job description
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-slate-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-100"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700"
                                >
                                    Next: Publishing
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Publishing Options */}
                    {step === 3 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">Publishing Options</h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <div className="font-semibold text-slate-900">Make Job Public</div>
                                        <p className="text-sm text-slate-500">Allow candidates to apply via public link</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_public"
                                            checked={formData.is_public}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Application Deadline (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        name="application_deadline"
                                        value={formData.application_deadline}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="active">Active - Accepting applications</option>
                                        <option value="draft">Draft - Not visible</option>
                                        <option value="paused">Paused - Temporarily not accepting</option>
                                    </select>
                                </div>

                                {/* Summary */}
                                <div className="bg-indigo-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-indigo-900 mb-2">Job Summary</h3>
                                    <ul className="space-y-1 text-sm text-indigo-700">
                                        <li>• <strong>{formData.title || 'Untitled Job'}</strong></li>
                                        <li>• {formData.question_count} AI interview questions</li>
                                        <li>• {formData.interview_duration} minute interview</li>
                                        <li>• {formData.difficulty_level} difficulty</li>
                                        <li>• {formData.passing_score}% passing score</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="text-slate-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-100"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Create Job
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
