// frontend src api templates.js 

import api from "./axiosInstance.js";

export const getTemplates = () => api.get("/api/templates");
export const createTemplate = (data) => api.post("/api/templates", data);
export const updateTemplate = (id, data) => api.put(`/api/templates/${id}`, data);
export const deleteTemplate = (id) => api.delete(`/api/templates/${id}`);