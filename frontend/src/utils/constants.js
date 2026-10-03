export const CATEGORIES = [
  { value: 'water', label: 'Water', icon: '💧' },
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'roads', label: 'Roads', icon: '🛣️' },
  { value: 'sanitation', label: 'Sanitation', icon: '🗑️' },
  { value: 'parks', label: 'Parks', icon: '🌳' },
  { value: 'other', label: 'Other', icon: '📋' },
];

export const STATUSES = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'in-progress', label: 'In Progress', color: '#3b82f6' },
  { value: 'resolved', label: 'Resolved', color: '#10b981' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' },
];

export const getCategoryInfo = (value) =>
  CATEGORIES.find((c) => c.value === value) || { value, label: value, icon: '📋' };

export const getStatusInfo = (value) =>
  STATUSES.find((s) => s.value === value) || { value, label: value, color: '#6b7280' };

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }
  return error.response?.data?.message || error.message || 'An unexpected error occurred.';
};
