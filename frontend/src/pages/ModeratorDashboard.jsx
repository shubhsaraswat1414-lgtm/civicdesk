import { useState, useEffect, useCallback } from 'react';
import { complaintsAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import FilterBar from '../components/FilterBar';
import Navbar from '../components/Navbar';
import { getErrorMessage, getStatusInfo } from '../utils/constants';

const STAT_ITEMS = [
  { key: 'pending', label: 'Pending', icon: '⏳' },
  { key: 'in-progress', label: 'In Progress', icon: '🔄' },
  { key: 'resolved', label: 'Resolved', icon: '✅' },
  { key: 'rejected', label: 'Rejected', icon: '❌' },
];

const ModeratorDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: [], byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 9 });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchStats = useCallback(async () => {
    try {
      const res = await complaintsAPI.getStats();
      setStats(res.data.stats);
    } catch {
      // Non-critical, silently fail
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      params.page = filters.page;
      params.limit = filters.limit;

      const res = await complaintsAPI.getAllComplaints(params);
      setComplaints(res.data.complaints);
      setPagination({ total: res.data.total, totalPages: res.data.totalPages });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const getStatCount = (statusKey) => {
    const found = stats.byStatus.find((s) => s._id === statusKey);
    return found ? found.count : 0;
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Moderator Dashboard</h1>
            <p className="page-subtitle">Review and manage all citizen complaints.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <span className="stat-count">{statsLoading ? '—' : stats.total}</span>
              <span className="stat-label">Total Complaints</span>
            </div>
          </div>
          {STAT_ITEMS.map((item) => {
            const statusInfo = getStatusInfo(item.key);
            return (
              <div
                key={item.key}
                className="stat-card"
                style={{ borderLeftColor: statusInfo.color }}
                onClick={() => setFilters({ page: 1, limit: 9, status: item.key })}
              >
                <div className="stat-icon">{item.icon}</div>
                <div className="stat-info">
                  <span className="stat-count" style={{ color: statusInfo.color }}>
                    {statsLoading ? '—' : getStatCount(item.key)}
                  </span>
                  <span className="stat-label">{item.label}</span>
                </div>
              </div>
            );
          })}
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
            <div className="empty-icon">🎉</div>
            <h3>No complaints found</h3>
            <p>No complaints match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="complaints-grid">
              {complaints.map((c) => (
                <ComplaintCard key={c._id} complaint={c} showActions={false} />
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

export default ModeratorDashboard;
