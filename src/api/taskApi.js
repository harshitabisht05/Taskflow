import apiClient from "./apiClient";

export const getTasks = async (projectId) => {
  const response = await apiClient.get(
    `/projects/${projectId}/tasks`
  );

  return response.data.data;
};

export const createTask = async (projectId, taskData) => {
  const response = await apiClient.post(
    `/projects/${projectId}/tasks`,
    taskData
  );

  return response.data.data;
};

export const updateTask = async (
  projectId,
  taskId,
  taskData
) => {
  const response = await apiClient.patch(
    `/projects/${projectId}/tasks/${taskId}`,
    taskData
  );

  return response.data.data;
};

export const deleteTask = async (projectId, taskId) => {
  const response = await apiClient.delete(
    `/projects/${projectId}/tasks/${taskId}`
  );

  return response.data;
};

export const reorderTasks = async (
  projectId,
  tasks
) => {
  const response = await apiClient.patch(
    `/projects/${projectId}/tasks/reorder`,
    {
      tasks,
    }
  );

  return response.data;
};