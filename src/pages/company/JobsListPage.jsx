import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
    Plus,
    Briefcase,
    MapPin,
    Users,
    Clock,
    MoreVertical,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Copy,
    ExternalLink,
    ChevronRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function JobsListPage() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companyId, setCompanyId] = useState(null);

    useEffect(() => {
        fetchCompanyAndJobs();
    }, []);

    const fetchCompanyAndJobs = async () => {
        try {
            const token = await getToken();

            // Get company first
            const companyRes = await fetch(`${API_BASE_URL}/api/companies/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!companyRes.ok) {
                navigate('/company/onboarding');
                return;
            }

            const company = await companyRes.json();
            setCompanyId(company.id);

            // Fetch jobs
            const jobsRes = await fetch(`${API_BASE_URL}/api/companies/${company.id}/jobs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (jobsRes.ok) {
                const data = await jobsRes.json();
                setJobs(data.jobs || []);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setJobs(jobs.filter(j => j.id !== jobId));
            }
        } catch (err) {
            console.error('Error deleting job:', err);
        }
    };

    const copyApplicationLink = (jobId) => {
        const link = `${window.location.origin}/apply/${jobId}`;
        navigator.clipboard.writeText(link);
        // Could add toast notification here
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
                        <p className="text-slate-600">Manage your job listings and view candidates</p>
                    </div>

                    <Link
                        to="/company/jobs/new"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Job
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="closed">Closed</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {jobs.length === 0 ? 'No job postings yet' : 'No matching jobs'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {jobs.length === 0
                                ? 'Create your first job to start receiving applications and screening candidates with AI.'
                                : 'Try adjusting your search or filters.'}
                        </p>
                        {jobs.length === 0 && (
                            <Link
                                to="/company/jobs/new"
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Job
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onDelete={() => handleDeleteJob(job.id)}
                                onCopyLink={() => copyApplicationLink(job.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function JobCard({ job, onDelete, onCopyLink }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const statusColors = {
        active: 'bg-green-100 text-green-700',
        paused: 'bg-yellow-100 text-yellow-700',
        closed: 'bg-slate-100 text-slate-700',
        draft: 'bg-blue-100 text-blue-700'
    };

    const stats = job.stats || {};

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-indigo-200 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            to={`/company/jobs/${job.id}`}
                            className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                            {job.title}
                        </Link>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[job.status] || statusColors.draft}`}>
                            {job.status}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                        {job.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                            </div>
                        )}
                        {job.job_type && (
                            <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                <span className="capitalize">{job.job_type}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Created {new Date(job.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">
                                <strong className="text-slate-900">{stats.total_candidates || 0}</strong>
                                <span className="text-slate-500"> candidates</span>
                            </span>
                        </div>
                        <div className="text-sm">
                            <span className="text-green-600 font-medium">{stats.shortlisted_candidates || 0}</span>
                            <span className="text-slate-500"> shortlisted</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-yellow-600 font-medium">{stats.pending_candidates || 0}</span>
                            <span className="text-slate-500"> pending</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Link
                        to={`/company/jobs/${job.id}/candidates`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View Candidates
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>

                        {menuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 w-48 z-20">
                                    <Link
                                        to={`/company/jobs/${job.id}`}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </Link>
                                    <Link
                                        to={`/company/jobs/${job.id}/edit`}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Job
                                    </Link>
                                    <button
                                        onClick={() => { onCopyLink(); setMenuOpen(false); }}
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 w-full text-left"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy Apply Link
                                    </button>
                                    <a
                                        href={`/apply/${job.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Preview Page
                                    </a>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                        onClick={() => { onDelete(); setMenuOpen(false); }}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Job
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
