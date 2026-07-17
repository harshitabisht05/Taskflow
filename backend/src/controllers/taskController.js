const Project = require("../models/Project");
const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    // Make sure the project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Find how many tasks already exist in this column
    const taskCount = await Task.countDocuments({
      project: projectId,
      status: status || "todo",
    });

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      position: taskCount,
      project: projectId,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
    }).sort({
      position: 1,
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        project: projectId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

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

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

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

    res.status(200).json({
      success: true,
      message: "Task order updated successfully",
    });
  } catch (error) {
    res.status(400).json({
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