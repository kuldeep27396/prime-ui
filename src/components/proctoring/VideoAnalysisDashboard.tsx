import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface AnalysisResult {
  overall_scores: {
    integrity_score: number;
    engagement_score: number;
    professionalism_score: number;
    overall_score: number;
  };
  insights: {
    summary: string;
    strengths: string[];
    areas_for_improvement: string[];
    red_flags: string[];
    recommendations: string[];
  };
  metadata: {
    frames_analyzed: number;
    analysis_type: string;
    cost_tier: string;
    timestamp: string;
  };
}

interface VideoAnalysisDashboardProps {
  videoUrl?: string;
  analysisResult?: AnalysisResult;
  onAnalyze?: (videoUrl: string, analysisType: string, costTier: string) => void;
}

const VideoAnalysisDashboard: React.FC<VideoAnalysisDashboardProps> = ({
  videoUrl,
  analysisResult,
  onAnalyze
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [costTier, setCostTier] = useState('standard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(analysisResult || null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !videoUrl) {
      alert('Please select a video file or provide a video URL');
      return;
    }

    setIsAnalyzing(true);

    try {
      let response;

      if (selectedFile) {
        // Upload and analyze file
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('analysis_type', analysisType);
        formData.append('cost_tier', costTier);

        response = await fetch('/api/v1/video-analysis/upload-and-analyze', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
      } else if (videoUrl) {
        // Analyze video URL
        response = await fetch('/api/v1/video-analysis/analyze-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            video_url: videoUrl,
            analysis_type: analysisType,
            cost_tier: costTier
          })
        });
      }

      if (response && response.ok) {
        const result = await response.json();
        if (result.success) {
          setCurrentResult(result.analysis_results);
          onAnalyze?.(videoUrl || selectedFile?.name || '', analysisType, costTier);
        } else {
          alert(`Analysis failed: ${result.error}`);
        }
      } else {
        alert('Analysis request failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed due to network error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Video Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Analysis Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Analysis Type
              </label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="comprehensive">Comprehensive</option>
                <option value="integrity">Integrity Only</option>
                <option value="engagement">Engagement Only</option>
                <option value="professionalism">Professionalism Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cost Tier
              </label>
              <select
                value={costTier}
                onChange={(e) => setCostTier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="basic">Basic (Fast & Cheap)</option>
                <option value="standard">Standard (Balanced)</option>
                <option value="premium">Premium (Detailed)</option>
              </select>
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!selectedFile && !videoUrl)}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Video'}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {currentResult && (
        <>
          {/* Overall Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg text-center ${getScoreColor(currentResult.overall_scores.overall_score)}`}>
                  <div className="text-2xl font-bold">
                    {(currentResult.overall_scores.overall_score * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm font-medium">Overall</div>
                  <div className="text-xs">
                    {getScoreLabel(currentResult.overall_scores.overall_score)}
                  </div>
                </div>

                <div className={`p-4 rounded-lg text-center ${getScoreColor(currentResult.overall_scores.integrity_score)}`}>
                  <div className="text-2xl font-bold">
                    {(currentResult.overall_scores.integrity_score * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm font-medium">Integrity</div>
                  <div className="text-xs">
                    {getScoreLabel(currentResult.overall_scores.integrity_score)}
                  </div>
                </div>

                <div className={`p-4 rounded-lg text-center ${getScoreColor(currentResult.overall_scores.engagement_score)}`}>
                  <div className="text-2xl font-bold">
                    {(currentResult.overall_scores.engagement_score * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm font-medium">Engagement</div>
                  <div className="text-xs">
                    {getScoreLabel(currentResult.overall_scores.engagement_score)}
                  </div>
                </div>

                <div className={`p-4 rounded-lg text-center ${getScoreColor(currentResult.overall_scores.professionalism_score)}`}>
                  <div className="text-2xl font-bold">
                    {(currentResult.overall_scores.professionalism_score * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm font-medium">Professionalism</div>
                  <div className="text-xs">
                    {getScoreLabel(currentResult.overall_scores.professionalism_score)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{currentResult.insights.summary}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                {currentResult.insights.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">✅ Strengths</h4>
                    <ul className="space-y-1">
                      {currentResult.insights.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Improvement */}
                {currentResult.insights.areas_for_improvement.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-yellow-700 mb-2">⚠️ Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {currentResult.insights.areas_for_improvement.map((area, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Red Flags */}
              {currentResult.insights.red_flags.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">🚨 Red Flags</h4>
                  <ul className="space-y-1">
                    {currentResult.insights.red_flags.map((flag, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {currentResult.insights.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-blue-700 mb-2">💡 Recommendations</h4>
                  <ul className="space-y-1">
                    {currentResult.insights.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-600">Frames Analyzed</div>
                  <div className="text-lg">{currentResult.metadata.frames_analyzed}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Analysis Type</div>
                  <div className="text-lg capitalize">{currentResult.metadata.analysis_type}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Cost Tier</div>
                  <div className="text-lg capitalize">{currentResult.metadata.cost_tier}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Analyzed At</div>
                  <div className="text-lg">
                    {new Date(currentResult.metadata.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VideoAnalysisDashboard;