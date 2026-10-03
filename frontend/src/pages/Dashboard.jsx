import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import FilterBar from '../components/FilterBar';
import Navbar from '../components/Navbar';
import { getErrorMessage } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 9 });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      params.page = filters.page;
      params.limit = filters.limit;

      const res = await complaintsAPI.getMyComplaints(params);
      setComplaints(res.data.complaints);
      setPagination({ total: res.data.total, totalPages: res.data.totalPages });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await complaintsAPI.deleteComplaint(id);
      fetchComplaints();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Complaints</h1>
            <p className="page-subtitle">
              Welcome back, <strong>{user?.name}</strong>. Track your submitted complaints here.
            </p>
          </div>
          <Link to="/complaints/new" className="btn btn-primary">
            + Raise Complaint
          </Link>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No complaints found</h3>
            <p>You haven&apos;t raised any complaints yet, or none match your filters.</p>
            <Link to="/complaints/new" className="btn btn-primary">
              Raise Your First Complaint
            </Link>
          </div>
        ) : (
          <>
            <div className="complaints-grid">
              {complaints.map((c) => (
                <ComplaintCard key={c._id} complaint={c} onDelete={handleDelete} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-ghost"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {filters.page} of {pagination.totalPages} ({pagination.total} total)
                </span>
                <button
                  className="btn btn-ghost"
                  disabled={filters.page >= pagination.totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
