import { CATEGORIES, STATUSES } from '../utils/constants';

const FilterBar = ({ filters, onChange, showUserFilter = false }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <select
          className="filter-select"
          value={filters.category || ''}
          onChange={(e) => onChange({ ...filters, category: e.target.value, page: 1 })}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {(filters.category || filters.status) && (
        <button
          className="btn btn-ghost"
          onClick={() => onChange({ page: 1 })}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
