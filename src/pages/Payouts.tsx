import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './Payouts.css';

interface Payout {
  _id: string;
  deviceId: string;
  amountUsd: number;
  status: 'pending' | 'paid' | 'rejected';
  requestedAt: string;
  paidAt?: string;
  txRef?: string;
  reason?: string;
}

export const Payouts: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchPayouts();
  }, [filter]);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? API_ENDPOINTS.PAYOUTS
        : `${API_ENDPOINTS.PAYOUTS}?status=${filter}`;
      const response = await axios.get(url);
      setPayouts(response.data.payouts);
    } catch (err) {
      setError('Failed to load payouts');
      console.error('Payouts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePayoutStatus = async (payoutId: string, status: 'paid' | 'rejected', txRef?: string) => {
    try {
      await axios.put(`${API_ENDPOINTS.PAYOUTS}/${payoutId}`, {
        status,
        txRef,
        adminNotes: `Updated by admin at ${new Date().toISOString()}`
      });
      fetchPayouts(); // Refresh the list
    } catch (err) {
      console.error('Update payout error:', err);
    }
  };

  if (loading) {
    return <div className="payouts">Loading payouts...</div>;
  }

  if (error) {
    return <div className="payouts error">Error: {error}</div>;
  }

  return (
    <div className="payouts">
      <h1>Payout Management</h1>
      
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'paid' ? 'active' : ''}
          onClick={() => setFilter('paid')}
        >
          Paid
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      <div className="payouts-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Device ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Paid</th>
              <th>Transaction Ref</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout._id}>
                <td>{payout._id.substring(0, 8)}...</td>
                <td>{payout.deviceId.substring(0, 8)}...</td>
                <td>${payout.amountUsd.toFixed(2)}</td>
                <td>
                  <span className={`status ${payout.status}`}>
                    {payout.status}
                  </span>
                </td>
                <td>{new Date(payout.requestedAt).toLocaleDateString()}</td>
                <td>{payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : '-'}</td>
                <td>{payout.txRef || '-'}</td>
                <td>
                  {payout.status === 'pending' && (
                    <>
                      <button 
                        className="btn-approve"
                        onClick={() => updatePayoutStatus(payout._id, 'paid')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => updatePayoutStatus(payout._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
