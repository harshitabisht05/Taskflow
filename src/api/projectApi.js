import apiClient from "./apiClient";

export const getProjects = async () => {
  const response = await apiClient.get("/projects");

  return response.data.data;
};

export const getProjectById = async (projectId) => {
  const response = await apiClient.get(
    `/projects/${projectId}`
  );

  return response.data.data;
};