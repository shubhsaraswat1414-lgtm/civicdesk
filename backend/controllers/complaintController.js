const Complaint = require('../models/Complaint');

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Private (citizen)
 */
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      raisedBy: req.user._id,
    });

    await complaint.populate('raisedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create complaint.' });
  }
};

/**
 * @desc    Get complaints raised by the logged-in citizen
 * @route   GET /api/complaints/my
 * @access  Private (citizen)
 */
const getMyComplaints = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    const filter = { raisedBy: req.user._id };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Complaint.countDocuments(filter);

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('raisedBy', 'name email');

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints.' });
  }
};

/**
 * @desc    Get all complaints (moderator only) with optional filters
 * @route   GET /api/complaints
 * @access  Private (moderator)
 */
const getAllComplaints = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Complaint.countDocuments(filter);

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('raisedBy', 'name email role');

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints.' });
  }
};

/**
 * @desc    Get a single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private (owner or moderator — handled by ownership middleware)
 */
const getComplaintById = async (req, res) => {
  try {
    // complaint is already attached by checkOwnership middleware
    await req.complaint.populate('raisedBy', 'name email role');

    res.status(200).json({
      success: true,
      complaint: req.complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaint.' });
  }
};

/**
 * @desc    Update complaint status and add moderator note
 * @route   PATCH /api/complaints/:id/status
 * @access  Private (moderator only)
 */
const updateStatus = async (req, res) => {
  try {
    const { status, moderatorNote } = req.body;

    // Find and update complaint
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    complaint.status = status;
    if (moderatorNote !== undefined) {
      complaint.moderatorNote = moderatorNote;
    }

    await complaint.save(); // triggers pre-save hook for resolvedAt
    await complaint.populate('raisedBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Complaint status updated to "${status}".`,
      complaint,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid complaint ID.' });
    }
    res.status(500).json({ success: false, message: 'Failed to update complaint status.' });
  }
};

/**
 * @desc    Delete a complaint (owner only)
 * @route   DELETE /api/complaints/:id
 * @access  Private (owner)
 */
const deleteComplaint = async (req, res) => {
  try {
    // Only the citizen who raised the complaint can delete it
    if (req.user.role !== 'moderator' && req.complaint.raisedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own complaints.',
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete complaint.' });
  }
};

/**
 * @desc    Get complaint statistics (moderator only)
 * @route   GET /api/complaints/stats
 * @access  Private (moderator)
 */
const getStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Complaint.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        total,
        byStatus: stats,
        byCategory: categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch statistics.' });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateStatus,
  deleteComplaint,
  getStats,
};
