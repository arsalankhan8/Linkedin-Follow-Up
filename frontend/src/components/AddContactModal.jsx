// src/components/AddContactModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createContact } from "@/api/contact";
import { toast } from "sonner";

/**
 * AddContactModal
 * props:
 *  - open (bool)
 *  - onClose (fn)
 *  - onSuccess (fn) optional -> called after successful POST
 */
export default function AddContactModal({ open, onClose, onSuccess, onContactAdded }) {

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

  // reset form when opened/closed
  useEffect(() => {
    if (open) {
      setName("");
      setProfileLink("");
      setCompany("");
      setRole("");
      setLastMessage("");
      setDateISO("");
      setDatePretty("");
      setStatus("Follow Up");
      setLoading(false);
    }
  }, [open]);

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
    // basic validation
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!profileLink.trim()) {
      toast.error("LinkedIn profile or email is required.");
      return;
    }
    if (!dateISO) {
      toast.error("Please choose a Next Follow-up date.");
      return;
    }

    const payload = {
      name: name.trim(),
      profileLink: profileLink.trim(),
      company: company.trim(),
      role: role.trim(),
      lastMessage: lastMessage.trim(),
      // send ISO date (server expects Date type)
      nextFollowUpDate: dateISO,
      // status enum: Follow Up | Pending Reply | Done
      status: status,
    };

    setLoading(true);

try {
  const res = await createContact(payload);
  toast.success("Contact added successfully! 🎉");
  onClose?.();
  onSuccess?.(res.data);
  
  // ✅ Trigger parent refresh
  onContactAdded?.();
  
} catch (err) {
  console.error(err);
  toast.error("Failed to save contact. Please try again.");
} finally {
  setLoading(false);
}

  };

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
            <h2 className="text-lg font-semibold">Add New Contact</h2>
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
                  className="w-full border rounded-md px-3 py-2 cursor-pointer"
                >
                  {datePretty || "Pick a date"}
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
                  <option value="Pending Reply">Pending Reply</option>
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
              {loading ? "Saving..." : "Save Contact"}
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};