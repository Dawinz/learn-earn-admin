import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './Settings.css';

interface Settings {
  minPayoutUsd: number;
  payoutCooldownHours: number;
  maxDailyEarnUsd: number;
  safetyMargin: number;
  eCPM_USD: number;
  impressionsToday: number;
  emulatorPayouts: boolean;
  coinToUsdRate: number;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    minPayoutUsd: 5,
    payoutCooldownHours: 48,
    maxDailyEarnUsd: 0.5,
    safetyMargin: 0.6,
    eCPM_USD: 1.5,
    impressionsToday: 0,
    emulatorPayouts: false,
    coinToUsdRate: 0.001
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.SETTINGS);
      setSettings(response.data.settings);
    } catch (err) {
      setError('Failed to load settings');
      console.error('Settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      await axios.put(API_ENDPOINTS.SETTINGS, settings);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Save settings error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="settings">Loading settings...</div>;
  }

  return (
    <div className="settings">
      <h1>System Settings</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="settings-form">
        <div className="form-section">
          <h2>Payout Settings</h2>
          <div className="form-group">
            <label>Minimum Payout (USD)</label>
            <input
              type="number"
              step="0.01"
              value={settings.minPayoutUsd}
              onChange={(e) => handleChange('minPayoutUsd', parseFloat(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Payout Cooldown (Hours)</label>
            <input
              type="number"
              value={settings.payoutCooldownHours}
              onChange={(e) => handleChange('payoutCooldownHours', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Max Daily Earn (USD)</label>
            <input
              type="number"
              step="0.01"
              value={settings.maxDailyEarnUsd}
              onChange={(e) => handleChange('maxDailyEarnUsd', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Revenue Settings</h2>
          <div className="form-group">
            <label>eCPM (USD)</label>
            <input
              type="number"
              step="0.01"
              value={settings.eCPM_USD}
              onChange={(e) => handleChange('eCPM_USD', parseFloat(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Safety Margin</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={settings.safetyMargin}
              onChange={(e) => handleChange('safetyMargin', parseFloat(e.target.value))}
            />
            <small>Percentage of revenue that can be used for payouts (0.6 = 60%)</small>
          </div>
          <div className="form-group">
            <label>Impressions Today</label>
            <input
              type="number"
              value={settings.impressionsToday}
              onChange={(e) => handleChange('impressionsToday', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Coin Settings</h2>
          <div className="form-group">
            <label>Coin to USD Rate</label>
            <input
              type="number"
              step="0.0001"
              value={settings.coinToUsdRate}
              onChange={(e) => handleChange('coinToUsdRate', parseFloat(e.target.value))}
            />
            <small>How much USD each coin is worth</small>
          </div>
        </div>

        <div className="form-section">
          <h2>Security Settings</h2>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.emulatorPayouts}
                onChange={(e) => handleChange('emulatorPayouts', e.target.checked)}
              />
              Allow Payouts on Emulator Devices
            </label>
            <small>Warning: Enabling this may increase fraud risk</small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn-save"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button 
            className="btn-reset"
            onClick={fetchSettings}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
