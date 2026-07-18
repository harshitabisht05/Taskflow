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

export const addProjectMember = async (
  projectId,
  email
) => {
  const response = await apiClient.post(
    `/projects/${projectId}/members`,
    {
      email,
    }
  );

  return response.data.data;
};

export const removeProjectMember = async (
  projectId,
  memberId
) => {
  const response = await apiClient.delete(
    `/projects/${projectId}/members/${memberId}`
  );

  return response.data;
};

export const createProject = async (projectData) => {
  const response = await apiClient.post(
    "/projects",
    projectData
  );

  return response.data.data;
};

export const updateProject = async (
  projectId,
  projectData
) => {
  const response = await apiClient.patch(
    `/projects/${projectId}`,
    projectData
  );

  return response.data.data;
};

export const deleteProject = async (projectId) => {
  const response = await apiClient.delete(
    `/projects/${projectId}`
  );

  return response.data;
};