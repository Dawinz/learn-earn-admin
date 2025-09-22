import React, { useState, useEffect } from 'react';
import './Users.css';

interface User {
  _id: string;
  deviceId: string;
  totalEarnings: number;
  totalPayouts: number;
  lastActive: string;
  isBlocked: boolean;
  createdAt: string;
  earningsCount: number;
  payoutsCount: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalEarnings: number;
  totalPayouts: number;
  averageEarningPerUser: number;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'earnings' | 'payouts' | 'lastActive' | 'created'>('earnings');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockUsers: User[] = [
        {
          _id: '1',
          deviceId: 'device_123456789',
          totalEarnings: 15.50,
          totalPayouts: 12.00,
          lastActive: new Date().toISOString(),
          isBlocked: false,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          earningsCount: 25,
          payoutsCount: 3
        },
        {
          _id: '2',
          deviceId: 'device_987654321',
          totalEarnings: 8.75,
          totalPayouts: 5.00,
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isBlocked: false,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          earningsCount: 18,
          payoutsCount: 2
        },
        {
          _id: '3',
          deviceId: 'device_555666777',
          totalEarnings: 22.30,
          totalPayouts: 20.00,
          lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isBlocked: true,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          earningsCount: 45,
          payoutsCount: 5
        }
      ];

      const mockStats: UserStats = {
        totalUsers: 150,
        activeUsers: 89,
        blockedUsers: 3,
        totalEarnings: 1250.75,
        totalPayouts: 980.50,
        averageEarningPerUser: 8.34
      };

      setUsers(mockUsers);
      setStats(mockStats);
    } catch (err) {
      setError('Failed to load users data');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.deviceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && !user.isBlocked) ||
      (filterStatus === 'blocked' && user.isBlocked);
    return matchesSearch && matchesFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'earnings':
        return b.totalEarnings - a.totalEarnings;
      case 'payouts':
        return b.totalPayouts - a.totalPayouts;
      case 'lastActive':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleBlockUser = async (userId: string) => {
    // Implement block user functionality
    console.log('Block user:', userId);
  };

  const handleUnblockUser = async (userId: string) => {
    // Implement unblock user functionality
    console.log('Unblock user:', userId);
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
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
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="earnings">Sort by Earnings</option>
            <option value="payouts">Sort by Payouts</option>
            <option value="lastActive">Sort by Last Active</option>
            <option value="created">Sort by Created</option>
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
            {sortedUsers.map((user) => (
              <tr key={user._id} className={user.isBlocked ? 'blocked' : ''}>
                <td>
                  <div className="device-id">
                    {user.deviceId.substring(0, 12)}...
                  </div>
                </td>
                <td>
                  <span className={`status ${user.isBlocked ? 'blocked' : 'active'}`}>
                    {user.isBlocked ? '🚫 Blocked' : '✅ Active'}
                  </span>
                </td>
                <td>
                  <span className="earnings">${user.totalEarnings.toFixed(2)}</span>
                </td>
                <td>
                  <span className="payouts">${user.totalPayouts.toFixed(2)}</span>
                </td>
                <td>
                  <span className="count">{user.earningsCount}</span>
                </td>
                <td>
                  <span className="date">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <span className="date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    {user.isBlocked ? (
                      <button
                        className="btn-unblock"
                        onClick={() => handleUnblockUser(user._id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="btn-block"
                        onClick={() => handleBlockUser(user._id)}
                      >
                        Block
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

      {sortedUsers.length === 0 && (
        <div className="no-users">
          <p>No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
