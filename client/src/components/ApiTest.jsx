// Test API Connection
import { useEffect, useState } from 'react';
import api from '../services/api';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/health');
        setStatus('✅ Connected to backend successfully!');
        console.log('Backend response:', response.data);
      } catch (err) {
        setStatus('❌ Failed to connect to backend');
        setError(err.message);
        console.error('Connection error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Backend Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      <hr />
      <p><strong>Backend URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
      <p><strong>Frontend URL:</strong> {window.location.origin}</p>
    </div>
  );
};

export default ApiTest;
