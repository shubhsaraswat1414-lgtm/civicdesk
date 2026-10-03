import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getCategoryInfo, getStatusInfo, formatDate, STATUSES, getErrorMessage } from '../utils/constants';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isModerator } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: '', moderatorNote: '' });
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await complaintsAPI.getComplaintById(id);
        setComplaint(res.data.complaint);
        setStatusForm({
          status: res.data.complaint.status,
          moderatorNote: res.data.complaint.moderatorNote || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess('');
    try {
      const res = await complaintsAPI.updateStatus(id, statusForm);
      setComplaint(res.data.complaint);
      setUpdateSuccess('Status updated successfully!');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="detail-skeleton">
            <div className="skeleton-line w-60" />
            <div className="skeleton-line w-40" />
            <div className="skeleton-line w-full" />
            <div className="skeleton-line w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="alert alert-error">{error}</div>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
        </main>
      </div>
    );
  }

  const category = getCategoryInfo(complaint.category);
  const status = getStatusInfo(complaint.status);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="detail-card">
          {/* Header */}
          <div className="detail-header">
            <div className="detail-category">
              <span className="category-icon-lg">{category.icon}</span>
              <span className="detail-category-label">{category.label}</span>
            </div>
            <span
              className="status-badge status-badge-lg"
              style={{ backgroundColor: status.color + '20', color: status.color, borderColor: status.color + '40' }}
            >
              {status.label}
            </span>
          </div>

          <h1 className="detail-title">{complaint.title}</h1>

          {/* Meta */}
          <div className="detail-meta">
            <div className="meta-chip">
              <span>👤</span>
              <span>{complaint.raisedBy?.name} ({complaint.raisedBy?.email})</span>
            </div>
            <div className="meta-chip">
              <span>📅</span>
              <span>Submitted: {formatDate(complaint.createdAt)}</span>
            </div>
            {complaint.location && (
              <div className="meta-chip">
                <span>📍</span>
                <span>{complaint.location}</span>
              </div>
            )}
            {complaint.resolvedAt && (
              <div className="meta-chip">
                <span>✅</span>
                <span>Resolved: {formatDate(complaint.resolvedAt)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="detail-section">
            <h2 className="section-title">Description</h2>
            <p className="detail-description">{complaint.description}</p>
          </div>

          {/* Moderator Note */}
          {complaint.moderatorNote && (
            <div className="detail-section moderator-note">
              <h2 className="section-title">🛡️ Moderator Note</h2>
              <p>{complaint.moderatorNote}</p>
            </div>
          )}

          {/* Moderator Update Panel */}
          {isModerator && (
            <div className="detail-section moderator-panel">
              <h2 className="section-title">Update Status</h2>
              {updateSuccess && <div className="alert alert-success">{updateSuccess}</div>}
              <form onSubmit={handleStatusUpdate} className="status-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={statusForm.status}
                      onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Moderator Note</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={3}
                    placeholder="Add a note for the citizen…"
                    value={statusForm.moderatorNote}
                    onChange={(e) => setStatusForm({ ...statusForm, moderatorNote: e.target.value })}
                    maxLength={500}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? <span className="btn-spinner" /> : 'Update Status'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
