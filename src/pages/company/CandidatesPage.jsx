import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
    ChevronLeft,
    Users,
    Search,
    Filter,
    Mail,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    Award,
    Eye,
    Send,
    MoreVertical,
    Star,
    AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function CandidatesPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [job, setJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [shortlistedOnly, setShortlistedOnly] = useState(false);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchData();
    }, [jobId, statusFilter, shortlistedOnly]);

    const fetchData = async () => {
        try {
            const token = await getToken();

            // Fetch job
            const jobRes = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!jobRes.ok) {
                navigate('/company/jobs');
                return;
            }

            const jobData = await jobRes.json();
            setJob(jobData);

            // Fetch candidates
            let url = `${API_BASE_URL}/api/jobs/${jobId}/candidates?limit=100`;
            if (statusFilter !== 'all') url += `&status_filter=${statusFilter}`;
            if (shortlistedOnly) url += `&shortlisted_only=true`;

            const candidatesRes = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (candidatesRes.ok) {
                const data = await candidatesRes.json();
                setCandidates(data.candidates || []);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    };

    const sendInvites = async () => {
        if (selectedCandidates.length === 0) return;

        setSending(true);
        const token = await getToken();

        for (const candidateId of selectedCandidates) {
            try {
                await fetch(`${API_BASE_URL}/api/candidates/${candidateId}/send-invite`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) {
                console.error('Error sending invite:', err);
            }
        }

        setSelectedCandidates([]);
        setSending(false);
        fetchData();
    };

    const runShortlisting = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/shortlist`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (res.ok) {
                const data = await res.json();
                alert(`Shortlisted ${data.shortlisted_count} candidates!`);
                fetchData();
            }
        } catch (err) {
            console.error('Error running shortlist:', err);
        }
    };

    const toggleSelect = (id) => {
        setSelectedCandidates(prev =>
            prev.includes(id)
                ? prev.filter(cid => cid !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedCandidates.length === filteredCandidates.length) {
            setSelectedCandidates([]);
        } else {
            setSelectedCandidates(filteredCandidates.map(c => c.id));
        }
    };

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        to="/company/jobs"
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900">{job?.title}</h1>
                        <p className="text-slate-600">Manage candidates and interviews</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Total" value={job?.stats?.total_candidates || 0} icon={Users} color="blue" />
                    <StatCard label="Shortlisted" value={job?.stats?.shortlisted_candidates || 0} icon={Star} color="green" />
                    <StatCard label="Interviewed" value={job?.stats?.interviewed_candidates || 0} icon={Award} color="purple" />
                    <StatCard label="Pending" value={job?.stats?.pending_candidates || 0} icon={Clock} color="orange" />
                </div>

                {/* Filters & Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="applied">Applied</option>
                                <option value="invited">Invited</option>
                                <option value="interview_completed">Interviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={shortlistedOnly}
                                    onChange={(e) => setShortlistedOnly(e.target.checked)}
                                    className="rounded text-indigo-600"
                                />
                                <span className="text-sm">Shortlisted only</span>
                            </label>
                        </div>

                        <div className="flex gap-2">
                            {selectedCandidates.length > 0 && (
                                <button
                                    onClick={sendInvites}
                                    disabled={sending}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    Send {selectedCandidates.length} Invite{selectedCandidates.length > 1 ? 's' : ''}
                                </button>
                            )}
                            <button
                                onClick={runShortlisting}
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                            >
                                <Award className="w-4 h-4" />
                                Run AI Shortlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Candidates Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {filteredCandidates.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No candidates yet</h3>
                            <p className="text-slate-600">
                                Share your job posting to start receiving applications.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedCandidates.length === filteredCandidates.length}
                                            onChange={toggleSelectAll}
                                            className="rounded text-indigo-600"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Candidate</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">AI Score</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Applied</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCandidates.map((candidate) => (
                                    <CandidateRow
                                        key={candidate.id}
                                        candidate={candidate}
                                        selected={selectedCandidates.includes(candidate.id)}
                                        onSelect={() => toggleSelect(candidate.id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                </div>
            </div>
        </div>
    );
}

function CandidateRow({ candidate, selected, onSelect }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const statusConfig = {
        applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700', icon: Clock },
        invited: { label: 'Invited', color: 'bg-purple-100 text-purple-700', icon: Mail },
        interview_scheduled: { label: 'Scheduled', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        interview_completed: { label: 'Interviewed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
        shortlisted: { label: 'Shortlisted', color: 'bg-emerald-100 text-emerald-700', icon: Star },
        rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
        hired: { label: 'Hired', color: 'bg-indigo-100 text-indigo-700', icon: Award }
    };

    const status = statusConfig[candidate.status] || statusConfig.applied;
    const StatusIcon = status.icon;

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    className="rounded text-indigo-600"
                />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                        {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{candidate.name}</p>
                        <p className="text-sm text-slate-500">{candidate.email}</p>
                    </div>
                    {candidate.shortlisted && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                </div>
            </td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                </span>
            </td>
            <td className="px-4 py-3">
                {candidate.ai_score !== null ? (
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${candidate.ai_score >= 70 ? 'bg-green-500' :
                                        candidate.ai_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${candidate.ai_score}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{candidate.ai_score}%</span>
                    </div>
                ) : (
                    <span className="text-slate-400 text-sm">—</span>
                )}
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
                {new Date(candidate.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/company/candidates/${candidate.id}`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 w-40 z-20">
                                    <button className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 w-full text-left text-sm">
                                        <Mail className="w-4 h-4" />
                                        Send Invite
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 w-full text-left text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        Shortlist
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left text-sm">
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
}
