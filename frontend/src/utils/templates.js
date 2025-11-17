// src/utils/templates.js
import { staticCategories } from "../pages/TemplatesPage.jsx";
import { getTemplates } from "../api/templates.js";

export const getCategoriesWithTemplates = async () => {
    try {
        const res = await getTemplates();
        const backendTemplates = res.data || [];

        const grouped = {};
        backendTemplates.forEach(t => {
            if (!grouped[t.category]) grouped[t.category] = [];
            grouped[t.category].push({ ...t, editing: false });
        });

        return staticCategories.map(cat => ({
            ...cat,
            templates: [...cat.templates, ...(grouped[cat.name] || [])],
        }));
    } catch (err) {
        console.error("Error fetching templates:", err);
        return staticCategories;
    }
};
