const express = require("express");

const {createTask,getTasks,updateTask,deleteTask,reorderTasks,} = require("../controllers/taskController");

const router = express.Router({mergeParams: true,});
const { requireProjectLead,} = require("../middleware/projectRoleMiddleware");

router.get("/", getTasks);
router.post("/", requireProjectLead, createTask);
router.patch("/reorder", reorderTasks);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", requireProjectLead, deleteTask);

module.exports = router;