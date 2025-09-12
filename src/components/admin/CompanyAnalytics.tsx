import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface OverviewMetrics {
  total_jobs: number;
  total_candidates: number;
  total_interviews: number;
  hire_rate: number;
}

interface FunnelMetrics {
  applications: number;
  screening: number;
  interviews: number;
  offers: number;
  hires: number;
}

interface PerformanceMetrics {
  avg_time_to_hire: number;
  interview_completion_rate: number;
  candidate_satisfaction: number;
  cost_per_hire: number;
}

interface TrendMetrics {
  applications_trend: number[];
  hire_rate_trend: number[];
}

interface CompanyAnalytics {
  overview: OverviewMetrics;
  funnel: FunnelMetrics;
  performance: PerformanceMetrics;
  trends: TrendMetrics;
}

export const CompanyAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.from) params.append('date_from', dateRange.from);
      if (dateRange.to) params.append('date_to', dateRange.to);

      const response = await fetch(`/api/v1/admin/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="flex justify-center p-8">No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Analytics</h2>
        <div className="flex space-x-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <Button
            variant="outline"
            onClick={() => setDateRange({ from: '', to: '' })}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_jobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_candidates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_interviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hire Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(analytics.overview.hire_rate)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Applications', value: analytics.funnel.applications, color: 'bg-blue-500' },
              { label: 'Screening', value: analytics.funnel.screening, color: 'bg-indigo-500' },
              { label: 'Interviews', value: analytics.funnel.interviews, color: 'bg-purple-500' },
              { label: 'Offers', value: analytics.funnel.offers, color: 'bg-pink-500' },
              { label: 'Hires', value: analytics.funnel.hires, color: 'bg-green-500' }
            ].map((stage, index) => {
              const percentage = analytics.funnel.applications > 0 
                ? (stage.value / analytics.funnel.applications) * 100 
                : 0;
              
              return (
                <div key={stage.label} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium">{stage.label}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`${stage.color} h-6 rounded-full flex items-center justify-center text-white text-sm font-medium`}
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    >
                      {stage.value}
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.performance.avg_time_to_hire}</div>
            <div className="text-sm text-gray-500">days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Interview Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(analytics.performance.interview_completion_rate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Candidate Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {analytics.performance.candidate_satisfaction.toFixed(1)}/5
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(analytics.performance.cost_per_hire)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Applications Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.trends.applications_trend.map((value, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm">Month {index + 1}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ 
                        width: `${(value / Math.max(...analytics.trends.applications_trend)) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="w-12 text-sm font-medium">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hire Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.trends.hire_rate_trend.map((value, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm">Month {index + 1}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-medium">{formatPercentage(value)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Export Analytics Report
            </Button>
            <Button variant="outline" size="sm">
              Schedule Weekly Report
            </Button>
            <Button variant="outline" size="sm">
              Compare with Previous Period
            </Button>
            <Button variant="outline" size="sm">
              View Detailed Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};