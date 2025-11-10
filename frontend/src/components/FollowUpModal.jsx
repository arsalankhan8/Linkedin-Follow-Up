// src/components/FollowUpModal.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Wand, Copy } from "lucide-react";

// Status select
function StatusSelect({ value, onChange, options = [] }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-[150px] focus:outline-none p-2.5 px-3.5 focus:ring-1 focus:ring-blue-500"
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}

// Pretty date picker
function PrettyDatePicker({ value, onChange }) {
    const [prettyDate, setPrettyDate] = useState("");

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            setPrettyDate(`${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`);
        } else {
            setPrettyDate("");
        }
    }, [value]);

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Next Follow-up Date</label>
            <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={value?.slice(0, 10) || ""}
                onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return onChange("");
                    const [y, m, d] = val.split("-");
                    onChange(new Date(y, m - 1, d).toISOString());
                }}
            />
        </div>
    );
}

// FollowUpModal
export default function FollowUpModal({ open, onClose, row, onSend, categories = [] }) {
    const [message, setMessage] = useState("");
    const [nextFollowUp, setNextFollowUp] = useState(row.nextFollowUpDate || "");
    const [status, setStatus] = useState("Followed Up");
    const [showFooterTemplateMenu, setShowFooterTemplateMenu] = useState(false);
    const [templateCategories, setTemplateCategories] = useState(

        categories.map((c) => ({ ...c, open: false }))
    );

    useEffect(() => {
        if (open) {
            setNextFollowUp(row.nextFollowUpDate || "");
            setStatus("Followed Up");
            setMessage("");
        }
    }, [open, row]);

    if (!open) return null;

    const handleInsertTemplate = (text) => {
        setMessage((prev) => prev + (prev ? "\n" : "") + text);
        setShowFooterTemplateMenu(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 relative shadow-lg w-full max-w-[900px]">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
                >
                    ×
                </button>

                {/* Header */}
                <h2 className="text-lg font-semibold mb-4">Send Follow-Up to {row.name}</h2>

                {/* Message */}
                <div className="relative mb-3">
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 resize-none h-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Type your follow-up message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            onClick={() => navigator.clipboard.writeText(message)}
                            className="text-gray-400 hover:text-gray-700"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    {/* Footer Inputs */}
                    <div className="flex justify-between items-end mt-2 gap-5 ">
                        {/* Footer Template Dropdown */}
                        {/* Footer Template Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">Template</label>

                            <button
                                onClick={() => setShowFooterTemplateMenu(prev => !prev)}
                                className="flex items-center gap-2 text-gray-700  border rounded p-2.5 px-3.5 "
                            >
                                <Wand size={16} /> Insert Template
                            </button>

                            {showFooterTemplateMenu && (
                                <div className="absolute right-0 mt-1 w-48 bg-white border rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {categories.map((cat, ci) => (
                                        <div key={ci} className="border-b last:border-b-0">
                                            <div className="px-3 py-2 font-semibold text-gray-700">{cat.name}</div>
                                            {cat.templates.map((t, ti) => (
                                                <button
                                                    key={ti}
                                                    onClick={() => handleInsertTemplate(t.body)}
                                                    className="w-full text-left px-5 py-2 text-sm text-gray-600 hover:bg-gray-100 truncate"
                                                    title={t.title}
                                                >
                                                    {t.title.length > 30 ? t.title.slice(0, 27) + "..." : t.title}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Date Picker */}
                        <div className="flex-1 ">
                            <PrettyDatePicker value={nextFollowUp} onChange={setNextFollowUp} />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium mb-1 ">Status</label>
                            <StatusSelect
                                value={status}
                                onChange={setStatus}
                                options={["Followed Up", "Pending"]}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-4 justify-end">
                        <Button onClick={onClose} variant="outline">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                onSend({ message, nextFollowUp, status }, row);
                                setMessage("");
                                onClose();
                            }}
                        >
                            Mark Sent
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
