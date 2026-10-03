const Complaint = require('../models/Complaint');

/**
 * Middleware: Check if the logged-in user owns the complaint OR is a moderator
 */
const checkOwnership = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Moderators can access any complaint
    if (req.user.role === 'moderator') {
      req.complaint = complaint;
      return next();
    }

    // Citizens can only access their own complaints
    if (complaint.raisedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own complaints.',
      });
    }

    req.complaint = complaint; // attach for reuse in controllers
    next();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid complaint ID.' });
    }
    res.status(500).json({ success: false, message: 'Server error checking ownership.' });
  }
};

module.exports = { checkOwnership };
