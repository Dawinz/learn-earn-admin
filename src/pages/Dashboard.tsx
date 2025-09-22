import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './Dashboard.css';

interface DashboardData {
  budget: {
    revenueToday: number;
    payoutBudgetToday: number;
    remainingBudget: number;
    payoutsToday: number;
    canPayout: boolean;
  };
  payoutsToday: Array<{
    _id: string;
    count: number;
    totalUsd: number;
  }>;
  pendingPayouts: Array<{
    _id: string;
    deviceId: string;
    amountUsd: number;
    requestedAt: string;
    status: string;
  }>;
  recentEarnings: Array<{
    _id: string;
    count: number;
    totalCoins: number;
    totalUsd: number;
  }>;
  settings: {
    eCPM_USD: number;
    safetyMargin: number;
    minPayoutUsd: number;
    maxDailyEarnUsd: number;
  };
  analytics: {
    totalUsers: number;
    activeUsersToday: number;
    totalLessons: number;
    publishedLessons: number;
    totalEarnings: number;
    totalPayouts: number;
    averageEarningPerUser: number;
    conversionRate: number;
  };
  dailyStats: Array<{
    date: string;
    earnings: number;
    payouts: number;
    users: number;
  }>;
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.DASHBOARD);
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dashboard">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard Overview</h1>
        <div className="dashboard-actions">
          <button className="btn-refresh" onClick={fetchDashboardData}>
            🔄 Refresh
          </button>
          <span className="last-updated">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="metrics-section">
        <h2>📈 Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>Total Users</h3>
              <p className="metric-value">{data.analytics?.totalUsers || 0}</p>
              <p className="metric-subtitle">Active today: {data.analytics?.activeUsersToday || 0}</p>
            </div>
          </div>
          <div className="metric-card success">
            <div className="metric-icon">📚</div>
            <div className="metric-content">
              <h3>Lessons</h3>
              <p className="metric-value">{data.analytics?.publishedLessons || 0}</p>
              <p className="metric-subtitle">of {data.analytics?.totalLessons || 0} total</p>
            </div>
          </div>
          <div className="metric-card warning">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Total Earnings</h3>
              <p className="metric-value">${(data.analytics?.totalEarnings || 0).toFixed(2)}</p>
              <p className="metric-subtitle">Avg per user: ${(data.analytics?.averageEarningPerUser || 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="metric-card info">
            <div className="metric-icon">📤</div>
            <div className="metric-content">
              <h3>Total Payouts</h3>
              <p className="metric-value">${(data.analytics?.totalPayouts || 0).toFixed(2)}</p>
              <p className="metric-subtitle">Conversion: {(data.analytics?.conversionRate || 0).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="budget-section">
        <h2>💳 Daily Budget</h2>
        <div className="budget-cards">
          <div className="budget-card">
            <h3>Revenue Today</h3>
            <p className="amount">${data.budget.revenueToday.toFixed(2)}</p>
            <div className="budget-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (data.budget.revenueToday / data.budget.payoutBudgetToday) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="budget-card">
            <h3>Payout Budget</h3>
            <p className="amount">${data.budget.payoutBudgetToday.toFixed(2)}</p>
            <div className="budget-status">
              <span className={`status-indicator ${data.budget.canPayout ? 'success' : 'warning'}`}>
                {data.budget.canPayout ? '✅ Can Payout' : '⚠️ Limited'}
              </span>
            </div>
          </div>
          <div className="budget-card">
            <h3>Remaining Budget</h3>
            <p className="amount">${data.budget.remainingBudget.toFixed(2)}</p>
            <div className="budget-usage">
              <span>Used: {((data.budget.payoutBudgetToday - data.budget.remainingBudget) / data.budget.payoutBudgetToday * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="budget-card">
            <h3>Payouts Today</h3>
            <p className="amount">{data.budget.payoutsToday}</p>
            <div className="payout-trend">
              <span>📈 +12% from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payouts Today */}
      <div className="payouts-section">
        <h2>Payouts Today</h2>
        <div className="payouts-grid">
          {data.payoutsToday.map((payout) => (
            <div key={payout._id} className="payout-item">
              <h4>{payout._id}</h4>
              <p>Count: {payout.count}</p>
              <p>Total: ${payout.totalUsd.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Payouts */}
      <div className="pending-section">
        <h2>Pending Payouts</h2>
        <div className="payouts-table">
          <table>
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Amount</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.pendingPayouts.map((payout) => (
                <tr key={payout._id}>
                  <td>{payout.deviceId.substring(0, 8)}...</td>
                  <td>${payout.amountUsd.toFixed(2)}</td>
                  <td>{new Date(payout.requestedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${payout.status}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-approve">Approve</button>
                    <button className="btn-reject">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Earnings */}
      <div className="earnings-section">
        <h2>Recent Earnings</h2>
        <div className="earnings-grid">
          {data.recentEarnings.map((earning) => (
            <div key={earning._id} className="earning-item">
              <h4>{earning._id}</h4>
              <p>Count: {earning.count}</p>
              <p>Coins: {earning.totalCoins}</p>
              <p>USD: ${earning.totalUsd.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Summary */}
      <div className="settings-section">
        <h2>Current Settings</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label>eCPM (USD)</label>
            <span>${data.settings.eCPM_USD}</span>
          </div>
          <div className="setting-item">
            <label>Safety Margin</label>
            <span>{(data.settings.safetyMargin * 100).toFixed(0)}%</span>
          </div>
          <div className="setting-item">
            <label>Min Payout (USD)</label>
            <span>${data.settings.minPayoutUsd}</span>
          </div>
          <div className="setting-item">
            <label>Max Daily Earn (USD)</label>
            <span>${data.settings.maxDailyEarnUsd}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
