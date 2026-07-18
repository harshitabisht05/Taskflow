const requireProjectLead = (req, res, next) => {
  if (!req.project) {
    return res.status(500).json({
      success: false,
      message: "Project access must be verified first",
    });
  }

  const isProjectLead =
    req.project.owner.toString() ===
    req.user._id.toString();

  if (!isProjectLead) {
    return res.status(403).json({
      success: false,
      message:
        "Only the project lead can perform this action",
    });
  }

  next();
};

module.exports = {
  requireProjectLead,
};