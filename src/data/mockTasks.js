const mockTasks = [
  {
    id: 1,
    projectId: 1,
    title: "Design dashboard layout",
    description: "Create the initial dashboard layout and reusable components.",
    status: "todo",
    priority: "High",
    dueDate: "July 20, 2026",
  },
  {
    id: 2,
    projectId: 3,
    title: "Create project cards",
    description: "Build reusable cards for displaying project information.",
    status: "done",
    priority: "Medium",
    dueDate: "July 18, 2026",
  },
  {
    id: 3,
    projectId: 1,
    title: "Build Kanban board",
    description: "Create the four-column layout for managing project tasks.",
    status: "in-progress",
    priority: "High",
    dueDate: "July 22, 2026",
  },
  {
    id: 4,
    projectId: 1,
    title: "Review responsive layout",
    description: "Test the application layout across different screen sizes.",
    status: "review",
    priority: "Medium",
    dueDate: "July 24, 2026",
  },
  {
    id: 5,
    projectId: 2,
    title: "Plan task creation flow",
    description: "Define how users will create new tasks from the Kanban board.",
    status: "todo",
    priority: "Low",
    dueDate: "July 26, 2026",
  },
];

export default mockTasks;