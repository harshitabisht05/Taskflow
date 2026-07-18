const express = require("express");

const {createProject,getProjects,getProjectById,updateProject,deleteProject,addProjectMember,removeProjectMember} = require("../controllers/projectController");
const {protect,} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/", protect, createProject);
router.get("/:projectId", protect, getProjectById);
router.patch("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);
router.post("/:projectId/members",protect,addProjectMember);
router.delete("/:projectId/members/:memberId",protect,removeProjectMember);

module.exports = router;