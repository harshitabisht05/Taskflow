const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");

// Create Project
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      dueDate,
      projectType,
    } = req.body;

    const project = await Project.create({
      name,
      description,
      status,
      dueDate,
      owner: req.user._id,
      projectType: projectType || "single",
    });

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Accessible Projects
const getProjects = async (req, res) => {
  try {
    // Get projects owned by the user
    // or projects where the user is a team member
    const projects = await Project.find({
      $or: [
        {
          owner: req.user._id,
        },
        {
          "members.user": req.user._id,
        },
      ],
    })
      .populate("owner", "name email")
      .sort({
        createdAt: -1,
      });

    // Get all accessible project IDs
    const projectIds = projects.map(
      (project) => project._id
    );

    // Calculate task statistics for all projects
    // in one aggregation query
    const taskStats = await Task.aggregate([
      {
        $match: {
          project: {
            $in: projectIds,
          },
        },
      },
      {
        $group: {
          _id: "$project",

          totalTasks: {
            $sum: 1,
          },

          completedTasks: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "done"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Add task statistics to each project
    const projectsWithProgress = projects.map(
      (project) => {
        const stats = taskStats.find(
          (item) =>
            item._id.toString() ===
            project._id.toString()
        );

        return {
          ...project.toObject(),

          totalTasks:
            stats?.totalTasks || 0,

          completedTasks:
            stats?.completedTasks || 0,
        };
      }
    );

    return res.status(200).json({
      success: true,
      count: projectsWithProgress.length,
      data: projectsWithProgress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,

      $or: [
        {
          owner: req.user._id,
        },
        {
          "members.user": req.user._id,
        },
      ],
    })
      .populate("owner", "name email")
      .populate(
        "members.user",
        "name email"
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const project =
      await Project.findOneAndUpdate(
        {
          _id: req.params.projectId,
          owner: req.user._id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Project updated successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Only the project owner can delete
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you are not authorized to delete it",
      });
    }

    // Delete all tasks belonging to project
    await Task.deleteMany({
      project: projectId,
    });

    // Delete project
    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Project Member
const addProjectMember = async (
  req,
  res
) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Member email is required",
      });
    }

    // Only project owner/team lead
    // can add members
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.projectType !== "team"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Members can only be added to team projects",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No registered user found with this email",
      });
    }

    // Prevent owner from being added
    // as a member
    if (
      project.owner.toString() ===
      user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project owner is already the team lead",
      });
    }

    // Prevent duplicate members
    const alreadyMember =
      project.members.some(
        (member) =>
          member.user.toString() ===
          user._id.toString()
      );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message:
          "User is already a member of this project",
      });
    }

    project.members.push({
      user: user._id,
      role: "member",
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message:
        "Team member added successfully",

      data: {
        member: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: "member",
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Project Member
const removeProjectMember = async (
  req,
  res
) => {
  try {
    const {
      projectId,
      memberId,
    } = req.params;

    // Only project owner / team lead
    // can remove members
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.projectType !== "team"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Members can only be removed from team projects",
      });
    }

    const memberExists =
      project.members.some(
        (member) =>
          member.user.toString() ===
          memberId
      );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message:
          "Team member not found",
      });
    }

    // Prevent removing a member
    // who still has assigned tasks
    const assignedTaskExists =
      await Task.exists({
        project: projectId,
        assignedTo: memberId,
      });

    if (assignedTaskExists) {
      return res.status(400).json({
        success: false,
        message:
          "This member still has assigned tasks. Reassign or unassign their tasks before removing them.",
      });
    }

    project.members =
      project.members.filter(
        (member) =>
          member.user.toString() !==
          memberId
      );

    await project.save();

    return res.status(200).json({
      success: true,
      message:
        "Team member removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};