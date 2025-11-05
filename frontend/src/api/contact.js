// src/api/contact.js
import api from "./axiosInstance";

export const createContact = (data) => api.post("/api/contacts", data);

export const getContacts = (params = {}) =>
  api.get("/api/contacts", { params });

export const updateContact = (id, data) =>
  api.put(`/api/contacts/${id}`, data); // ✅ fix this
