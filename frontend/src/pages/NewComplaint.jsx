import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { CATEGORIES, getErrorMessage } from '../utils/constants';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await complaintsAPI.createComplaint(form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Raise a Complaint</h1>
            <p className="page-subtitle">Submit a new civic complaint for review by our moderators.</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
        </div>

        <div className="form-card">
          {success && (
            <div className="alert alert-success">
              ✅ Complaint submitted successfully! Redirecting…
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Complaint Title <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                minLength={5}
                maxLength={100}
                className="form-input"
                placeholder="e.g. Burst water pipe on Main Street"
                value={form.title}
                onChange={handleChange}
              />
              <span className="char-count">{form.title.length}/100</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="form-input"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  maxLength={200}
                  className="form-input"
                  placeholder="e.g. 12 Park Avenue, Sector 5"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                minLength={10}
                maxLength={1000}
                rows={5}
                className="form-input form-textarea"
                placeholder="Describe the issue in detail…"
                value={form.description}
                onChange={handleChange}
              />
              <span className="char-count">{form.description.length}/1000</span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || success}>
                {loading ? <span className="btn-spinner" /> : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewComplaint;
