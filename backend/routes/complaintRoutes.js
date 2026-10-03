const express = require('express');
const { body, param } = require('express-validator');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateStatus,
  deleteComplaint,
  getStats,
} = require('../controllers/complaintController');
const { protect, moderatorOnly } = require('../middleware/auth');
const { checkOwnership } = require('../middleware/ownership');
const { validate } = require('../middleware/validate');

const router = express.Router();

const VALID_CATEGORIES = ['water', 'electricity', 'roads', 'sanitation', 'parks', 'other'];
const VALID_STATUSES = ['pending', 'in-progress', 'resolved', 'rejected'];

// Validation rules
const createComplaintValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5–100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10–1000 characters'),
  body('category').isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('location').optional().trim().isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
];

const updateStatusValidation = [
  param('id').isMongoId().withMessage('Invalid complaint ID'),
  body('status').isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('moderatorNote').optional().trim().isLength({ max: 500 }).withMessage('Note cannot exceed 500 characters'),
];

// All routes require authentication
router.use(protect);

// Moderator: get stats
router.get('/stats', moderatorOnly, getStats);

// Moderator: get all complaints with optional filters
router.get('/', moderatorOnly, getAllComplaints);

// Citizen: get their own complaints
router.get('/my', getMyComplaints);

// Create a new complaint (citizens only — moderators shouldn't raise complaints)
router.post('/', createComplaintValidation, validate, createComplaint);

// Get single complaint (owner or moderator)
router.get('/:id', checkOwnership, getComplaintById);

// Moderator: update complaint status
router.patch('/:id/status', moderatorOnly, updateStatusValidation, validate, updateStatus);

// Delete complaint (owner or moderator)
router.delete('/:id', checkOwnership, deleteComplaint);

module.exports = router;
