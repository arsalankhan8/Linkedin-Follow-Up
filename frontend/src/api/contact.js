// src/api/contact.js
import api from "./axiosInstance";

export const createContact = (data) => api.post("/api/contacts", data);
export const getContacts = () => api.get("/api/contacts");