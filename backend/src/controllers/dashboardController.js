const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        {
          owner: req.user._id,
        },
        {
          "members.user": req.user._id,
        },
      ],
    }).select("_id");

    const projectIds = projects.map(
      (project) => project._id
    );

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
    ] = await Promise.all([
      Task.countDocuments({
        project: {
          $in: projectIds,
        },
      }),

      Task.countDocuments({
        project: {
          $in: projectIds,
        },
        status: "done",
      }),

      Task.countDocuments({
        project: {
          $in: projectIds,
        },
        status: "in-progress",
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};