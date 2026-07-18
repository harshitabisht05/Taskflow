const Project = require("../models/Project");

const checkProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
    _id: projectId,
    $or: [
        {
        owner: req.user._id,
        },
        {
        "members.user": req.user._id,
        },
    ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Make the verified project available
    // to the next middleware/controller.
    req.project = project;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  checkProjectAccess,
};