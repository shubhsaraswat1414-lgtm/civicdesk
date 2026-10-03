import { getCategoryInfo, getStatusInfo, formatDate } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const ComplaintCard = ({ complaint, onDelete, showActions = true }) => {
  const navigate = useNavigate();
  const category = getCategoryInfo(complaint.category);
  const status = getStatusInfo(complaint.status);

  return (
    <div className="complaint-card" onClick={() => navigate(`/complaints/${complaint._id}`)}>
      <div className="card-header">
        <div className="card-category">
          <span className="category-icon">{category.icon}</span>
          <span className="category-label">{category.label}</span>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: status.color + '20', color: status.color, borderColor: status.color + '40' }}
        >
          {status.label}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{complaint.title}</h3>
        <p className="card-description">{complaint.description}</p>
      </div>

      <div className="card-footer">
        <div className="card-meta">
          {complaint.location && (
            <span className="meta-item">
              <span className="meta-icon">📍</span> {complaint.location}
            </span>
          )}
          <span className="meta-item">
            <span className="meta-icon">📅</span> {formatDate(complaint.createdAt)}
          </span>
          {complaint.raisedBy && (
            <span className="meta-item">
              <span className="meta-icon">👤</span> {complaint.raisedBy.name}
            </span>
          )}
        </div>

        {showActions && onDelete && (
          <button
            className="btn btn-danger-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(complaint._id);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
