import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function WalletInfo() {
  const [balance, setBalance] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchBalance = () => {
    api
      .getWalletBalance()
      .then((b) => setBalance(b.balance))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setNewAddress(null);
    try {
      const result = await api.generateAddress();
      setNewAddress(result.address);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">
            {balance !== null ? Number(balance).toFixed(4) : '…'}
          </div>
          <div className="stat-label">Wallet Balance (ZEC)</div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">{error.message}</div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Generate Address</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
          Create a new transparent address for receiving donations.
        </p>

        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? 'Generating…' : 'Generate New Address'}
        </button>

        {newAddress && (
          <div
            className="alert alert-success"
            style={{ marginTop: 16 }}
          >
            <strong>New Address:</strong>
            <div className="mono" style={{ marginTop: 6, fontSize: 13 }}>
              {newAddress}
            </div>
            <button
              className="btn btn-sm btn-secondary"
              style={{ marginTop: 8 }}
              onClick={() => navigator.clipboard.writeText(newAddress)}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
