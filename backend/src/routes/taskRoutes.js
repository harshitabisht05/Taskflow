const express = require("express");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/taskController");

const router = express.Router({
  mergeParams: true,
});

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/reorder", reorderTasks);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;