// src/components/AddContactModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createContact, updateContact } from "@/api/contact";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

/**
 * AddContactModal
 * props:
 *  - open (bool)
 *  - onClose (fn)
 *  - onSuccess (fn) optional -> called after successful POST
 */
export default function AddContactModal({ open, onClose, onSuccess, onContactAdded, editData }) {

  const [name, setName] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [dateISO, setDateISO] = useState(""); // store ISO for sending
  const [datePretty, setDatePretty] = useState(""); // show "3 Nov 2025"
  const [status, setStatus] = useState("Follow Up");
  const [loading, setLoading] = useState(false);
  const hiddenDateRef = useRef(null);


  useEffect(() => {
    if (!open) return;

    if (editData) {
      setName(editData.name || "");
      setProfileLink(editData.profileLink || "");
      setCompany(editData.company || "");
      setRole(editData.role || "");
      setLastMessage(editData.lastMessage || "");
      setStatus(editData.status || "Follow Up");

      // Pre-fill Date
      if (editData.nextFollowUpDate) {
        const d = new Date(editData.nextFollowUpDate);
        const iso = d.toISOString();
        setDateISO(iso);
        setDatePretty(formatPretty(iso));
      } else {
        setDateISO("");
        setDatePretty("");
      }
    } else {
      // If adding new contact
      setName("");
      setProfileLink("");
      setCompany("");
      setRole("");
      setLastMessage("");
      setDateISO("");
      setDatePretty("");
      setStatus("Follow Up");
    }
  }, [open, editData]);


  if (!open) return null;

  // format JS Date -> "3 Nov 2025"
  function formatPretty(d) {
    if (!d) return "";
    try {
      const dt = new Date(d);
      const day = dt.getDate(); // no leading zero
      const month = dt.toLocaleString("en-US", { month: "short" }); // "Nov"
      const year = dt.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "";
    }
  }

  // When the (hidden) native date input changes
  function onNativeDateChange(e) {
    const val = e.target.value; // YYYY-MM-DD
    if (!val) {
      setDateISO("");
      setDatePretty("");
      return;
    }
    // convert to ISO midnight in local timezone then to UTC iso string
    const [y, m, d] = val.split("-");
    const localDate = new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0);
    const iso = localDate.toISOString(); // will be saved
    setDateISO(iso);
    setDatePretty(formatPretty(localDate)); // show pretty
  }

  // Click on visible pretty input opens native date input
  function openDatePicker() {
    if (hiddenDateRef.current) hiddenDateRef.current.showPicker?.() ?? hiddenDateRef.current.click();
  }

  async function handleSubmit() {

    // ---- VALIDATION RULES ----
    if (!name.trim()) {
      return toast.error("Name is required.");
    }
    if (name.length > 30) {
      return toast.error("Name must be 30 characters or less.");
    }

    // Profile can be EMAIL or LINKEDIN URL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/i;

    if (!profileLink.trim()) {
      return toast.error("LinkedIn profile or email is required.");
    }
    if (!emailRegex.test(profileLink) && !linkedinRegex.test(profileLink)) {
      return toast.error("Enter a valid email or LinkedIn profile URL.");
    }

    if (company.length > 40) {
      return toast.error("Company name must be 40 characters or less.");
    }

    if (role.length > 40) {
      return toast.error("Role must be 40 characters or less.");
    }

    if (lastMessage.length > 300) {
      return toast.error("Last message must be 300 characters or less.");
    }

    if (!dateISO) {
      return toast.error("Please choose a Next Follow-up date.");
    }

    const payload = {
      name: name.trim(),
      profileLink: profileLink.trim(),
      company: company.trim(),
      role: role.trim(),
      lastMessage: lastMessage.trim(),
      nextFollowUpDate: dateISO,
      status,
    };

    setLoading(true);

    try {
      if (editData?._id) {
        // UPDATE MODE
        await updateContact(editData._id, payload);
        toast.success("Contact updated successfully!");
      } else {
        // CREATE MODE
        await createContact(payload);
        toast.success("Contact added successfully!");
      }

      onClose?.();
      onSuccess?.();
      onContactAdded?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong. Try again.");
    }
    finally {
      setLoading(false);
    }

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* grey blur backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onClose?.()}
      />

      {/* modal box */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl z-10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editData ? "Edit Contact" : "Add New Contact"}
            </h2>
            <button
              className="text-slate-500 hover:text-slate-700"
              onClick={() => onClose?.()}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn profile URL or Email</label>
              <input
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://www.linkedin.com/in/john or email@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Role"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Message</label>
              <textarea
                value={lastMessage}
                onChange={(e) => setLastMessage(e.target.value)}
                rows={3}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Message summary..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              {/* Pretty date display */}
              <div>
                <label className="block text-sm font-medium mb-1">Next Follow-up Date</label>
                <div
                  role="button"
                  onClick={openDatePicker}
                  className="w-full border rounded-md px-3 py-2 cursor-pointer flex items-center justify-between"
                >
                  <span>{datePretty || "Pick a date"}</span>
                  <Calendar className="text-gray-800" size={18} />
                </div>
                {/* hidden native date input used to pick */}
                <input
                  ref={hiddenDateRef}
                  type="date"
                  className="hidden"
                  onChange={onNativeDateChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="Follow Up">Follow Up</option>
                  <option value="Pending">Pending Reply</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button className="border" onClick={() => onClose?.()} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Saving..." : editData ? "Update Contact" : "Save Contact"}
            </Button>


          </div>
        </div>
      </div>
    </div>
  );
};