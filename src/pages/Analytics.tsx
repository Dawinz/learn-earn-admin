import React, { useState, useEffect } from 'react';
import './Analytics.css';

interface AnalyticsData {
  dailyStats: Array<{
    date: string;
    earnings: number;
    payouts: number;
    users: number;
    lessons: number;
  }>;
  weeklyStats: Array<{
    week: string;
    earnings: number;
    payouts: number;
    users: number;
  }>;
  monthlyStats: Array<{
    month: string;
    earnings: number;
    payouts: number;
    users: number;
  }>;
  topEarners: Array<{
    deviceId: string;
    totalEarnings: number;
    totalPayouts: number;
    earningsCount: number;
  }>;
  lessonStats: Array<{
    lessonId: string;
    title: string;
    completions: number;
    averageScore: number;
    earnings: number;
  }>;
  sourceStats: Array<{
    source: string;
    count: number;
    totalEarnings: number;
    percentage: number;
  }>;
}

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'lessons' | 'sources'>('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData: AnalyticsData = {
        dailyStats: generateDailyStats(),
        weeklyStats: generateWeeklyStats(),
        monthlyStats: generateMonthlyStats(),
        topEarners: [
          { deviceId: 'device_123456789', totalEarnings: 45.50, totalPayouts: 40.00, earningsCount: 78 },
          { deviceId: 'device_987654321', totalEarnings: 38.75, totalPayouts: 35.00, earningsCount: 65 },
          { deviceId: 'device_555666777', totalEarnings: 32.30, totalPayouts: 30.00, earningsCount: 58 },
          { deviceId: 'device_111222333', totalEarnings: 28.90, totalPayouts: 25.00, earningsCount: 52 },
          { deviceId: 'device_444555666', totalEarnings: 25.60, totalPayouts: 22.00, earningsCount: 48 }
        ],
        lessonStats: [
          { lessonId: '1', title: 'Introduction to Online Earning', completions: 125, averageScore: 85.5, earnings: 1250.00 },
          { lessonId: '2', title: 'Freelancing Basics', completions: 98, averageScore: 82.3, earnings: 980.00 },
          { lessonId: '3', title: 'Content Creation', completions: 87, averageScore: 88.7, earnings: 870.00 },
          { lessonId: '4', title: 'E-commerce Strategies', completions: 76, averageScore: 79.2, earnings: 760.00 },
          { lessonId: '5', title: 'Digital Marketing', completions: 65, averageScore: 91.1, earnings: 650.00 }
        ],
        sourceStats: [
          { source: 'quiz', count: 450, totalEarnings: 2250.00, percentage: 60.5 },
          { source: 'ad-reward', count: 280, totalEarnings: 1050.00, percentage: 28.2 },
          { source: 'lesson-completion', count: 95, totalEarnings: 285.00, percentage: 7.7 },
          { source: 'daily-bonus', count: 25, totalEarnings: 125.00, percentage: 3.4 }
        ]
      };

      setData(mockData);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyStats = () => {
    const stats = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      stats.push({
        date: date.toISOString().split('T')[0],
        earnings: Math.random() * 100 + 50,
        payouts: Math.random() * 80 + 30,
        users: Math.floor(Math.random() * 20) + 10,
        lessons: Math.floor(Math.random() * 15) + 5
      });
    }
    return stats;
  };

  const generateWeeklyStats = () => {
    const stats = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      stats.push({
        week: `Week ${12 - i}`,
        earnings: Math.random() * 500 + 200,
        payouts: Math.random() * 400 + 150,
        users: Math.floor(Math.random() * 50) + 30
      });
    }
    return stats;
  };

  const generateMonthlyStats = () => {
    const stats = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      stats.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        earnings: Math.random() * 2000 + 1000,
        payouts: Math.random() * 1600 + 800,
        users: Math.floor(Math.random() * 100) + 50
      });
    }
    return stats.reverse();
  };

  const getCurrentStats = () => {
    if (!data) return null;
    
    switch (timeRange) {
      case '7d':
        return data.dailyStats.slice(-7);
      case '30d':
        return data.dailyStats;
      case '90d':
        return data.weeklyStats.slice(-12);
      case '1y':
        return data.monthlyStats;
      default:
        return data.dailyStats;
    }
  };

  if (loading) {
    return (
      <div className="analytics">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="analytics">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const currentStats = getCurrentStats();

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>📈 Analytics Dashboard</h1>
        <div className="analytics-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-refresh" onClick={fetchAnalytics}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="analytics-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          📚 Lessons
        </button>
        <button
          className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          💰 Sources
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="overview-content">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <h3>Total Earnings</h3>
                <p className="summary-value">
                  ${currentStats?.reduce((sum, stat) => sum + stat.earnings, 0).toFixed(2) || '0.00'}
                </p>
                <p className="summary-change">+12.5% from last period</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📤</div>
              <div className="summary-content">
                <h3>Total Payouts</h3>
                <p className="summary-value">
                  ${currentStats?.reduce((sum, stat) => sum + stat.payouts, 0).toFixed(2) || '0.00'}
                </p>
                <p className="summary-change">+8.3% from last period</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">👥</div>
              <div className="summary-content">
                <h3>Active Users</h3>
                <p className="summary-value">
                  {currentStats?.reduce((sum, stat) => sum + stat.users, 0) || 0}
                </p>
                <p className="summary-change">+15.2% from last period</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📚</div>
              <div className="summary-content">
                <h3>Lesson Completions</h3>
                <p className="summary-value">
                  {currentStats?.reduce((sum, stat) => sum + stat.lessons, 0) || 0}
                </p>
                <p className="summary-change">+22.1% from last period</p>
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="chart-container">
            <h3>Earnings Trend</h3>
            <div className="chart-placeholder">
              <p>📊 Chart visualization would go here</p>
              <p>Showing {timeRange} data with {currentStats?.length || 0} data points</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="users-content">
          <h3>Top Earners</h3>
          <div className="top-earners">
            {data.topEarners.map((earner, index) => (
              <div key={earner.deviceId} className="earner-card">
                <div className="earner-rank">#{index + 1}</div>
                <div className="earner-info">
                  <div className="earner-id">{earner.deviceId.substring(0, 12)}...</div>
                  <div className="earner-stats">
                    <span>Earnings: ${earner.totalEarnings.toFixed(2)}</span>
                    <span>Payouts: ${earner.totalPayouts.toFixed(2)}</span>
                    <span>Actions: {earner.earningsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="lessons-content">
          <h3>Lesson Performance</h3>
          <div className="lesson-stats">
            {data.lessonStats.map((lesson) => (
              <div key={lesson.lessonId} className="lesson-card">
                <div className="lesson-title">{lesson.title}</div>
                <div className="lesson-metrics">
                  <div className="metric">
                    <span className="metric-label">Completions</span>
                    <span className="metric-value">{lesson.completions}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Avg Score</span>
                    <span className="metric-value">{lesson.averageScore.toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Earnings</span>
                    <span className="metric-value">${lesson.earnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="sources-content">
          <h3>Earning Sources</h3>
          <div className="source-stats">
            {data.sourceStats.map((source) => (
              <div key={source.source} className="source-card">
                <div className="source-name">{source.source}</div>
                <div className="source-bar">
                  <div 
                    className="source-fill" 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <div className="source-details">
                  <span>{source.count} actions</span>
                  <span>${source.totalEarnings.toFixed(2)}</span>
                  <span>{source.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
