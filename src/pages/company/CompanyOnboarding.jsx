import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
    Building2,
    Mail,
    Globe,
    Users,
    MapPin,
    ChevronRight,
    CheckCircle,
    Upload
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const INDUSTRIES = [
    'Technology',
    'Finance & Banking',
    'Healthcare',
    'E-commerce',
    'Education',
    'Manufacturing',
    'Consulting',
    'Media & Entertainment',
    'Real Estate',
    'Other'
];

const COMPANY_SIZES = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '500+'
];

export default function CompanyOnboarding() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        industry: '',
        company_size: '',
        headquarters: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();

            const response = await fetch(`${API_BASE_URL}/api/companies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to register company');
            }

            setStep(3); // Success step

            // Redirect after short delay
            setTimeout(() => {
                navigate('/company/dashboard');
            }, 2000);

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s < step ? 'bg-green-500 text-white' :
                                    s === step ? 'bg-white text-indigo-600' :
                                        'bg-white/20 text-white/50'
                                }`}>
                                {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-1 mx-2 rounded ${s < step ? 'bg-green-500' : 'bg-white/20'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {step === 1 && (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">Register Your Company</h1>
                                <p className="text-slate-600 mt-2">Start screening candidates with AI in minutes</p>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Company Name *
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Acme Corporation"
                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Company Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="hr@company.com"
                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Website
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                placeholder="https://company.com"
                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-slate-900">Company Details</h1>
                                <p className="text-slate-600 mt-2">Tell us more about your company</p>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Industry *
                                        </label>
                                        <select
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select industry</option>
                                            {INDUSTRIES.map(ind => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Company Size *
                                        </label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {COMPANY_SIZES.map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, company_size: size }))}
                                                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${formData.company_size === size
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Headquarters
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="headquarters"
                                                value={formData.headquarters}
                                                onChange={handleChange}
                                                placeholder="San Francisco, CA"
                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Brief description of your company..."
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Complete Setup
                                                <ChevronRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Prime Interviews!</h1>
                            <p className="text-slate-600 mb-4">
                                Your company has been registered successfully. You have 2 free AI interviews to get started.
                            </p>
                            <div className="bg-indigo-50 rounded-lg p-4 text-left">
                                <h3 className="font-semibold text-indigo-900 mb-2">Getting Started:</h3>
                                <ul className="space-y-2 text-indigo-700">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Create your first job posting
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Share the application link
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Let AI screen candidates
                                    </li>
                                </ul>
                            </div>
                            <p className="text-sm text-slate-500 mt-4">Redirecting to dashboard...</p>
                        </div>
                    )}
                </div>

                {/* Benefits */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center text-white/80 text-sm">
                    <div>
                        <div className="font-bold text-2xl text-white">24/7</div>
                        AI Screening
                    </div>
                    <div>
                        <div className="font-bold text-2xl text-white">80%</div>
                        Time Saved
                    </div>
                    <div>
                        <div className="font-bold text-2xl text-white">2 Free</div>
                        Interviews
                    </div>
                </div>
            </div>
        </div>
    );
}
