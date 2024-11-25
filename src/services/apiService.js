import axios from 'axios';

const API_BASE_URL = "http://localhost:3000"; // Replace with your backend URL

export const getProjects = async () => {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;
};

export const addProject = async (projectData) => {
    const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
    return response.data;
};

export const updateProject = async (id, projectData) => {
    const response = await axios.put(`${API_BASE_URL}/projects/${id}`, projectData);
    return response.data;
};

export const deleteProject = async (id) => {
    await axios.delete(`${API_BASE_URL}/projects/${id}`);
};
