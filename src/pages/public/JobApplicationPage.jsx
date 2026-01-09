import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Clock,
    Briefcase,
    Upload,
    CheckCircle,
    Loader2,
    AlertCircle,
    FileText
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function JobApplicationPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        cover_letter: ''
    });
    const [resume, setResume] = useState(null);

    useEffect(() => {
        fetchJob();
    }, [jobId]);

    const fetchJob = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/public`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError('This job posting is no longer available.');
                } else if (response.status === 410) {
                    setError('The application deadline has passed.');
                } else {
                    setError('Failed to load job details.');
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            setJob(data);
            setLoading(false);

        } catch (err) {
            setError('Failed to load job details.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Resume file must be less than 5MB');
                return;
            }
            setResume(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('linkedin_url', formData.linkedin_url);
            formDataToSend.append('cover_letter', formData.cover_letter);
            if (resume) {
                formDataToSend.append('resume', resume);
            }

            const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to submit application');
            }

            setSubmitted(true);

        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Job</h1>
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

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h1>
                    <p className="text-slate-600 mb-6">
                        Thank you for applying to <strong>{job.title}</strong> at <strong>{job.company_name}</strong>.
                    </p>

                    <div className="bg-slate-50 rounded-lg p-4 text-left mb-6">
                        <h3 className="font-semibold text-slate-900 mb-2">What's Next?</h3>
                        <ul className="space-y-2 text-slate-600 text-sm">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>We've received your application</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>You may receive an AI interview invitation via email</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>Check your email (including spam) for updates</span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-sm text-slate-500">
                        You may close this window now.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    {job.company_logo ? (
                        <img src={job.company_logo} alt={job.company_name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                    )}
                    <div>
                        <h1 className="font-bold text-slate-900">{job.title}</h1>
                        <p className="text-slate-600 text-sm">{job.company_name}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Job Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                            <h2 className="font-bold text-slate-900 mb-4">Job Details</h2>

                            <div className="space-y-3 text-sm">
                                {job.location && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{job.location}</span>
                                    </div>
                                )}

                                {job.job_type && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <span className="capitalize">{job.job_type}</span>
                                    </div>
                                )}

                                {(job.experience_min || job.experience_max) && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>{job.experience_min}-{job.experience_max} years experience</span>
                                    </div>
                                )}
                            </div>

                            {job.skills_required && job.skills_required.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills_required.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.description && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
                                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{job.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Apply Now</h2>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            LinkedIn Profile
                                        </label>
                                        <input
                                            type="url"
                                            name="linkedin_url"
                                            value={formData.linkedin_url}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/in/johndoe"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Resume
                                    </label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                                        <input
                                            type="file"
                                            id="resume"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleResumeChange}
                                            className="hidden"
                                        />

                                        {resume ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <FileText className="w-8 h-8 text-indigo-600" />
                                                <div className="text-left">
                                                    <p className="font-medium text-slate-900">{resume.name}</p>
                                                    <p className="text-sm text-slate-500">{(resume.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setResume(null)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <label htmlFor="resume" className="cursor-pointer">
                                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                                <p className="text-slate-600 text-sm">
                                                    <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-slate-400 text-xs mt-1">PDF, DOC, DOCX (max 5MB)</p>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Cover Letter
                                    </label>
                                    <textarea
                                        name="cover_letter"
                                        value={formData.cover_letter}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell us why you're a great fit for this role..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-slate-500 text-center">
                                    By submitting, you agree to have your application reviewed by AI screening technology.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
