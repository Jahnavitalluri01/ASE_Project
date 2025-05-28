import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminProvidersRequest = () => {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending providers
  const fetchPendingProviders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/providers/pending');
      setPendingProviders(res.data);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  // Approve a provider
  const approveProvider = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/providers/approve/${userId}`);
      setPendingProviders(prev => prev.filter(p => p.id !== userId));
    } catch (err) {
      console.error('Error approving provider:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Pending Service Providers</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" />
        </div>
      ) : pendingProviders.length === 0 ? (
        <div className="alert alert-success">No pending providers.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {pendingProviders.map((provider) => (
              <tr key={provider.id}>
                <td>{provider.name}</td>
                <td>{provider.email}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => approveProvider(provider.id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProvidersRequest;
