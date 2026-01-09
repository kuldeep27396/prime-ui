import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import {
    Building2,
    Briefcase,
    Users,
    TrendingUp,
    Plus,
    ChevronRight,
    Award,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function CompanyDashboard() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoaded && user) {
            fetchCompanyData();
        }
    }, [isLoaded, user]);

    const fetchCompanyData = async () => {
        try {
            const token = await getToken();

            // Fetch company
            const companyRes = await fetch(`${API_BASE_URL}/api/companies/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!companyRes.ok) {
                if (companyRes.status === 404) {
                    setError('no_company');
                    setLoading(false);
                    return;
                }
                throw new Error('Failed to fetch company');
            }

            const companyData = await companyRes.json();
            setCompany(companyData);

            // Fetch jobs
            const jobsRes = await fetch(`${API_BASE_URL}/api/companies/${companyData.id}/jobs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setJobs(jobsData.jobs || []);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching company data:', err);
            setError('Failed to load company data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error === 'no_company') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <Building2 className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Prime Interviews</h2>
                    <p className="text-slate-600 mb-6">
                        Get started by registering your company to access AI-powered candidate screening.
                    </p>
                    <Link
                        to="/company/onboarding"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Register Your Company
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={fetchCompanyData}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const stats = company?.stats || {};

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        {company?.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="w-16 h-16 rounded-xl object-cover" />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{company?.name}</h1>
                            <p className="text-slate-600">{company?.industry || 'Company'}</p>
                        </div>
                    </div>

                    <Link
                        to="/company/jobs/new"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Job
                    </Link>
                </div>

                {/* Credits Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold opacity-90">Interview Credits</h3>
                            <p className="text-3xl font-bold">{stats.credits_remaining || 0} remaining</p>
                            <p className="opacity-75 text-sm">{stats.credits_used || 0} used this month</p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium capitalize">
                                {company?.plan_type || 'free'} plan
                            </span>
                            <Link to="/company/billing" className="text-sm underline hover:no-underline">
                                Upgrade Plan
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={Briefcase}
                        label="Active Jobs"
                        value={stats.active_jobs || 0}
                        color="blue"
                    />
                    <StatCard
                        icon={Users}
                        label="Total Candidates"
                        value={stats.total_candidates || 0}
                        color="purple"
                    />
                    <StatCard
                        icon={Award}
                        label="Shortlisted"
                        value={stats.total_shortlisted || 0}
                        color="green"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Interviews"
                        value={stats.total_interviews || 0}
                        color="orange"
                    />
                </div>

                {/* Jobs List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>
                        <Link to="/company/jobs" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            View All
                        </Link>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="p-8 text-center">
                            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No job postings yet</h3>
                            <p className="text-slate-600 mb-4">Create your first job to start screening candidates with AI.</p>
                            <Link
                                to="/company/jobs/new"
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Job
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {jobs.slice(0, 5).map((job) => (
                                <JobRow key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickAction
                        to="/company/candidates"
                        icon={Users}
                        title="View Candidates"
                        description="Review all applicants"
                    />
                    <QuickAction
                        to="/company/analytics"
                        icon={TrendingUp}
                        title="Analytics"
                        description="View hiring metrics"
                    />
                    <QuickAction
                        to="/company/settings"
                        icon={Building2}
                        title="Settings"
                        description="Manage company profile"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-slate-600 text-sm">{label}</p>
        </div>
    );
}

function JobRow({ job }) {
    const statusColors = {
        active: 'bg-green-100 text-green-700',
        paused: 'bg-yellow-100 text-yellow-700',
        closed: 'bg-slate-100 text-slate-700',
        draft: 'bg-blue-100 text-blue-700'
    };

    return (
        <Link
            to={`/company/jobs/${job.id}`}
            className="block p-4 hover:bg-slate-50 transition-colors"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                        <span>{job.location || 'Remote'}</span>
                        <span>•</span>
                        <span>{job.stats?.total_candidates || 0} candidates</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[job.status] || statusColors.draft}`}>
                        {job.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
            </div>
        </Link>
    );
}

function QuickAction({ to, icon: Icon, title, description }) {
    return (
        <Link
            to={to}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
            <Icon className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-slate-600 text-sm">{description}</p>
        </Link>
    );
}
