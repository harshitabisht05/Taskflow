const express = require("express");

const {
  createProject,   getProjects,getProjectById,updateProject,deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:projectId", getProjectById);
router.patch("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

module.exports = router;