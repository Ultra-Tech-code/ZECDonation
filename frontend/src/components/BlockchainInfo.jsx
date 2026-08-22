import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function BlockchainInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getBlockchainInfo()
      .then(setInfo)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Fetching blockchain info…
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        Could not reach Zcash node: {error.message}
      </div>
    );
  }

  const fields = [
    { label: 'Chain', value: info.chain },
    { label: 'Blocks', value: info.blocks?.toLocaleString() },
    { label: 'Headers', value: info.headers?.toLocaleString() },
    { label: 'Difficulty', value: info.difficulty?.toExponential(3) },
    { label: 'Verification Progress', value: `${(info.verificationprogress * 100).toFixed(2)}%` },
    { label: 'Size on Disk', value: info.size_on_disk ? `${(info.size_on_disk / 1e9).toFixed(2)} GB` : '—' },
    { label: 'Protocol Version', value: info.protocolversion },
    { label: 'Wallet Version', value: info.walletversion },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Blockchain Info</h2>
        <span className="badge badge-completed">Connected</span>
      </div>

      <div className="detail-grid">
        {fields.map((f) => (
          <div className="detail-item" key={f.label}>
            <div className="detail-label">{f.label}</div>
            <div className="detail-value">{f.value ?? '…'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
