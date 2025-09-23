import React, { useState, useEffect } from 'react';
import './VersionManagement.css';

interface VersionInfo {
  minimumVersion: string;
  minimumBuildNumber: number;
  latestVersion: string;
  latestBuildNumber: number;
  forceUpdate: boolean;
  updateMessage: string;
  updateTitle: string;
  androidDownloadUrl: string;
  iosDownloadUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  features: {
    adsEnabled: boolean;
    notificationsEnabled: boolean;
    payoutsEnabled: boolean;
    newFeatures: string[];
  };
}

export const VersionManagement: React.FC = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVersionInfo();
  }, []);

  const fetchVersionInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://learn-and-earn-04ok.onrender.com'}/api/version`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch version info');
      }

      const data = await response.json();
      if (data.success) {
        setVersionInfo(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch version info');
      }
    } catch (err) {
      console.error('Version fetch error:', err);
      setError('Failed to load version information');
    } finally {
      setLoading(false);
    }
  };

  const updateVersionInfo = async (updatedInfo: Partial<VersionInfo>) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://learn-and-earn-04ok.onrender.com'}/api/version`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedInfo)
      });

      if (!response.ok) {
        throw new Error('Failed to update version info');
      }

      const data = await response.json();
      if (data.success) {
        setVersionInfo(prev => prev ? { ...prev, ...updatedInfo } : null);
        alert('Version settings updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update version info');
      }
    } catch (err) {
      console.error('Version update error:', err);
      setError('Failed to update version settings');
    } finally {
      setSaving(false);
    }
  };

  const handleForceUpdate = () => {
    if (versionInfo) {
      updateVersionInfo({ forceUpdate: !versionInfo.forceUpdate });
    }
  };

  const handleMaintenanceMode = () => {
    if (versionInfo) {
      updateVersionInfo({ maintenanceMode: !versionInfo.maintenanceMode });
    }
  };

  if (loading) {
    return (
      <div className="version-management">
        <div className="loading">Loading version management...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="version-management">
        <div className="error">{error}</div>
        <button onClick={fetchVersionInfo} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="version-management">
      <div className="version-header">
        <h1>📱 Version Management</h1>
        <p>Control app updates and maintenance mode</p>
      </div>

      {versionInfo && (
        <div className="version-content">
          {/* Force Update Section */}
          <div className="version-section">
            <h2>Force Update</h2>
            <div className="toggle-section">
              <div className="toggle-info">
                <h3>Force All Users to Update</h3>
                <p>When enabled, all users will be forced to update before using the app</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={versionInfo.forceUpdate}
                  onChange={handleForceUpdate}
                  disabled={saving}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Maintenance Mode Section */}
          <div className="version-section">
            <h2>Maintenance Mode</h2>
            <div className="toggle-section">
              <div className="toggle-info">
                <h3>Enable Maintenance Mode</h3>
                <p>When enabled, all users will see a maintenance message</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={versionInfo.maintenanceMode}
                  onChange={handleMaintenanceMode}
                  disabled={saving}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Version Information */}
          <div className="version-section">
            <h2>Version Information</h2>
            <div className="version-grid">
              <div className="version-item">
                <label>Minimum Version</label>
                <input
                  type="text"
                  value={versionInfo.minimumVersion}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, minimumVersion: e.target.value } : null)}
                  className="version-input"
                />
              </div>
              <div className="version-item">
                <label>Minimum Build Number</label>
                <input
                  type="number"
                  value={versionInfo.minimumBuildNumber}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, minimumBuildNumber: parseInt(e.target.value) || 1 } : null)}
                  className="version-input"
                />
              </div>
              <div className="version-item">
                <label>Latest Version</label>
                <input
                  type="text"
                  value={versionInfo.latestVersion}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, latestVersion: e.target.value } : null)}
                  className="version-input"
                />
              </div>
              <div className="version-item">
                <label>Latest Build Number</label>
                <input
                  type="number"
                  value={versionInfo.latestBuildNumber}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, latestBuildNumber: parseInt(e.target.value) || 1 } : null)}
                  className="version-input"
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="version-section">
            <h2>Messages</h2>
            <div className="message-grid">
              <div className="message-item">
                <label>Update Title</label>
                <input
                  type="text"
                  value={versionInfo.updateTitle}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, updateTitle: e.target.value } : null)}
                  className="message-input"
                />
              </div>
              <div className="message-item">
                <label>Update Message</label>
                <textarea
                  value={versionInfo.updateMessage}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, updateMessage: e.target.value } : null)}
                  className="message-textarea"
                  rows={3}
                />
              </div>
              <div className="message-item">
                <label>Maintenance Message</label>
                <textarea
                  value={versionInfo.maintenanceMessage}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, maintenanceMessage: e.target.value } : null)}
                  className="message-textarea"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Download URLs */}
          <div className="version-section">
            <h2>Download URLs</h2>
            <div className="url-grid">
              <div className="url-item">
                <label>Android Download URL</label>
                <input
                  type="url"
                  value={versionInfo.androidDownloadUrl}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, androidDownloadUrl: e.target.value } : null)}
                  className="url-input"
                />
              </div>
              <div className="url-item">
                <label>iOS Download URL</label>
                <input
                  type="url"
                  value={versionInfo.iosDownloadUrl}
                  onChange={(e) => setVersionInfo(prev => prev ? { ...prev, iosDownloadUrl: e.target.value } : null)}
                  className="url-input"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="version-actions">
            <button
              onClick={() => updateVersionInfo(versionInfo)}
              disabled={saving}
              className="btn-save"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
