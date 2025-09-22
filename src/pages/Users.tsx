import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './Users.css';

interface User {
  _id: string;
  deviceId: string;
  totalEarningsUsd: number;
  totalPayoutsUsd: number;
  lastActivity: string;
  status: 'active' | 'blocked';
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalEarnings: number;
  totalPayouts: number;
  averageEarningPerUser: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'totalEarningsUsd' | 'totalPayoutsUsd' | 'lastActivity' | 'createdAt'>('totalEarningsUsd');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortKey: sortBy,
        sortOrder: 'desc'
      });
      
      if (searchTerm) {
        params.append('filter', searchTerm);
      }
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const response = await axios.get(`${API_ENDPOINTS.USERS}?${params}`);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load users data');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortBy, searchTerm, filterStatus]);

  const fetchUserStats = useCallback(async () => {
    try {
      // Get all users for stats calculation
      const response = await axios.get(`${API_ENDPOINTS.USERS}?limit=1000`);
      const allUsers = response.data.users;
      
      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter((user: User) => user.status === 'active').length;
      const blockedUsers = allUsers.filter((user: User) => user.status === 'blocked').length;
      const totalEarnings = allUsers.reduce((sum: number, user: User) => sum + user.totalEarningsUsd, 0);
      const totalPayouts = allUsers.reduce((sum: number, user: User) => sum + user.totalPayoutsUsd, 0);
      const averageEarningPerUser = totalUsers > 0 ? totalEarnings / totalUsers : 0;

      setStats({
        totalUsers,
        activeUsers,
        blockedUsers,
        totalEarnings,
        totalPayouts,
        averageEarningPerUser
      });
    } catch (err) {
      console.error('User stats error:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [fetchUsers, fetchUserStats]);


  // Users are already filtered and sorted by the backend
  const displayUsers = users;

  const handleBlockUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      await axios.put(`${API_ENDPOINTS.USERS}/${userId}/block`);
      await fetchUsers(); // Refresh the list
      await fetchUserStats(); // Refresh stats
    } catch (err) {
      setError('Failed to block user');
      console.error('Block user error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      await axios.put(`${API_ENDPOINTS.USERS}/${userId}/unblock`);
      await fetchUsers(); // Refresh the list
      await fetchUserStats(); // Refresh stats
    } catch (err) {
      setError('Failed to unblock user');
      console.error('Unblock user error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleFilterChange = (value: 'all' | 'active' | 'blocked') => {
    setFilterStatus(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSortChange = (value: 'totalEarningsUsd' | 'totalPayoutsUsd' | 'lastActivity' | 'createdAt') => {
    setSortBy(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <div className="users">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="users">
      <div className="users-header">
        <h1>👥 User Management</h1>
        <div className="users-actions">
          <button className="btn-refresh" onClick={fetchUsers}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* User Stats */}
      {stats && (
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Active Users</h3>
              <p className="stat-value">{stats.activeUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚫</div>
            <div className="stat-content">
              <h3>Blocked Users</h3>
              <p className="stat-value">{stats.blockedUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Earnings</h3>
              <p className="stat-value">${stats.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📤</div>
            <div className="stat-content">
              <h3>Total Payouts</h3>
              <p className="stat-value">${stats.totalPayouts.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Avg per User</h3>
              <p className="stat-value">${stats.averageEarningPerUser.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by device ID..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="filter-select"
          >
            <option value="totalEarningsUsd">Sort by Earnings</option>
            <option value="totalPayoutsUsd">Sort by Payouts</option>
            <option value="lastActivity">Sort by Last Active</option>
            <option value="createdAt">Sort by Created</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Status</th>
              <th>Total Earnings</th>
              <th>Total Payouts</th>
              <th>Earnings Count</th>
              <th>Last Active</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((user) => (
              <tr key={user._id} className={user.status === 'blocked' ? 'blocked' : ''}>
                <td>
                  <div className="device-id">
                    {user.deviceId.substring(0, 12)}...
                  </div>
                </td>
                <td>
                  <span className={`status ${user.status === 'blocked' ? 'blocked' : 'active'}`}>
                    {user.status === 'blocked' ? '🚫 Blocked' : '✅ Active'}
                  </span>
                </td>
                <td>
                  <span className="earnings">${user.totalEarningsUsd.toFixed(2)}</span>
                </td>
                <td>
                  <span className="payouts">${user.totalPayoutsUsd.toFixed(2)}</span>
                </td>
                <td>
                  <span className="count">{user.totalEarningsUsd > 0 ? 'Yes' : 'No'}</span>
                </td>
                <td>
                  <span className="date">
                    {new Date(user.lastActivity).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <span className="date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    {user.status === 'blocked' ? (
                      <button
                        className="btn-unblock"
                        onClick={() => handleUnblockUser(user._id)}
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? '⏳' : 'Unblock'}
                      </button>
                    ) : (
                      <button
                        className="btn-block"
                        onClick={() => handleBlockUser(user._id)}
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? '⏳' : 'Block'}
                      </button>
                    )}
                    <button className="btn-view">View Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total users)
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {displayUsers.length === 0 && !loading && (
        <div className="no-users">
          <p>No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
