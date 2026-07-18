const Project = require("../models/Project");
const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

    // Project access has already been verified by
    // checkProjectAccess middleware and is available as req.project.
    const project = req.project;

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Validate task assignment
    if (assignedTo) {
      // Assignment is only available for team projects
      if (project.projectType !== "team") {
        return res.status(400).json({
          success: false,
          message:
            "Tasks can only be assigned in team projects",
        });
      }

      // The assigned user must be a member of this project
      const isProjectMember = project.members.some(
        (member) =>
          member.user.toString() ===
          assignedTo.toString()
      );

      if (!isProjectMember) {
        return res.status(400).json({
          success: false,
          message:
            "Task can only be assigned to a project member",
        });
      }
    }

    // Determine the task's initial column
    const taskStatus = status || "todo";

    // Find how many tasks already exist in this column
    // so the new task can be placed at the end.
    const taskCount = await Task.countDocuments({
      project: projectId,
      status: taskStatus,
    });

    // Create task
    const task = await Task.create({
      title,
      description,
      status: taskStatus,
      priority,
      dueDate,
      position: taskCount,
      project: projectId,
      assignedTo: assignedTo || null,
    });

    // Populate assigned user information
    await task.populate(
      "assignedTo",
      "name email"
    );

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all tasks belonging to a project
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
    })
      .populate(
        "assignedTo",
        "name email"
      )
      .sort({
        position: 1,
      });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOne({
      _id: taskId,
      project: projectId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const isProjectLead =
      req.project.owner.toString() ===
      req.user._id.toString();

    // Project owner/team lead can update everything
    if (isProjectLead) {
  const { assignedTo } = req.body;

  // Validate assignment if an assignee is provided
  if (assignedTo) {
    if (req.project.projectType !== "team") {
      return res.status(400).json({
        success: false,
        message:
          "Tasks can only be assigned in team projects",
      });
    }

    const isProjectMember =
      req.project.members.some(
        (member) =>
          member.user.toString() ===
          assignedTo.toString()
      );

    if (!isProjectMember) {
      return res.status(400).json({
        success: false,
        message:
          "Task can only be assigned to a project member",
      });
    }
  }

  Object.assign(task, {
    ...req.body,
    assignedTo: assignedTo || null,
  });
} else {
      // Regular members can only modify tasks
      // specifically assigned to them.
      const isAssignedMember =
        task.assignedTo?.toString() ===
        req.user._id.toString();

      if (!isAssignedMember) {
        return res.status(403).json({
          success: false,
          message:
            "You can only update tasks assigned to you",
        });
      }

      // Members can only change task status
      if (!req.body.status) {
        return res.status(403).json({
          success: false,
          message:
            "Team members can only update task status",
        });
      }

      const allowedStatuses = [
        "todo",
        "in-progress",
        "review",
        "done",
      ];

      if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
        });
      }

      task.status = req.body.status;
    }

    await task.save();

    await task.populate(
      "assignedTo",
      "name email"
    );

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      project: projectId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task status and position after drag and drop
const reorderTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: "Tasks must be an array",
      });
    }

    const isProjectLead =
      req.project.owner.toString() ===
      req.user._id.toString();

    // Project owner / team lead can reorder all tasks
    if (isProjectLead) {
      const updates = tasks.map((task) =>
        Task.updateOne(
          {
            _id: task._id,
            project: projectId,
          },
          {
            status: task.status,
            position: task.position,
          }
        )
      );

      await Promise.all(updates);

      return res.status(200).json({
        success: true,
        message: "Task order updated successfully",
      });
    }

    // Regular members may only update their own assigned task.
    // Find which submitted tasks actually changed.
    const existingTasks = await Task.find({
      project: projectId,
    });

    const changedTasks = tasks.filter(
      (submittedTask) => {
        const existingTask = existingTasks.find(
          (task) =>
            task._id.toString() ===
            submittedTask._id.toString()
        );

        if (!existingTask) {
          return false;
        }

        return (
          existingTask.status !==
            submittedTask.status ||
          existingTask.position !==
            submittedTask.position
        );
      }
    );

    // A member can only move one task at a time
    if (changedTasks.length !== 1) {
      return res.status(403).json({
        success: false,
        message:
          "Team members cannot reorder project tasks",
      });
    }

    const changedTask = changedTasks[0];

    const existingTask = existingTasks.find(
      (task) =>
        task._id.toString() ===
        changedTask._id.toString()
    );

    const isAssignedMember =
      existingTask.assignedTo?.toString() ===
      req.user._id.toString();

    if (!isAssignedMember) {
      return res.status(403).json({
        success: false,
        message:
          "You can only move tasks assigned to you",
      });
    }

    const allowedStatuses = [
      "todo",
      "in-progress",
      "review",
      "done",
    ];

    if (
      !allowedStatuses.includes(changedTask.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    // Member changes only status.
    // Position is controlled by the lead/reordering system.
    existingTask.status = changedTask.status;

    await existingTask.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  reorderTasks,
};