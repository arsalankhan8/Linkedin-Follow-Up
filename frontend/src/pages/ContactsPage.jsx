// src/pages/ContactsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import DataTable from "../components/DataTable.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getContacts } from "@/api/contact.js";
import AddContactModal from "../components/AddContactModal.jsx";
import { getCategoriesWithTemplates } from "../utils/templates";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  useDropdown,
} from "../components/ui/select.jsx";

const StatCard = ({ title, value, accentColor = "border-indigo-500" }) => (
  <Card
    className={`rounded-2xl shadow-sm hover:shadow-md transition-shadow border-l-4 ${accentColor} bg-white`}
  >
    <CardContent className="p-5">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </CardContent>
  </Card>
);

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [contacts, setContacts] = useState([]); // paginated data
  const [allContacts, setAllContacts] = useState([]); // full list for stats

  const [statusFilter, setStatusFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [categories, setCategories] = useState(getCategoriesWithTemplates);

  function handleEdit(contact) {
    setEditingContact(contact);
    setModalOpen(true);
  }

  // Fetch all contacts ONCE for stats
  useEffect(() => {
    const refreshContacts = async () => {
      const res = await getContacts({ limit: 9999, page: 1 });
      setAllContacts(res.data.contacts);
    };

    // ✅ Initial load
    refreshContacts();

    // ✅ Listen for new contact event
    const handleContactAdded = () => {
      refreshContacts();
    };

    window.addEventListener("contactAdded", handleContactAdded);

    return () => {
      window.removeEventListener("contactAdded", handleContactAdded);
    };
  }, []);

  async function fetchContacts() {
    const res = await getContacts({ limit: 9999, page: 1 });
    setAllContacts(res.data.contacts);
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const mergedCategories = await getCategoriesWithTemplates();
        setCategories(mergedCategories);
      } catch (err) {
        console.error("Failed to load templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  const statusDropdown = useDropdown();
  const stateDropdown = useDropdown();

  const rows = allContacts.map((c) => ({
    ...c,
    status:
      c.status === "Follow Up"
        ? "Follow-Up"
        : c.status === "Pending"
        ? "Pending Reply"
        : c.status,
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rowsWithState = rows.map((r) => {
    const followDate = r.nextFollowUpDate ? new Date(r.nextFollowUpDate) : null;
    let statusType = null; // only followup states

    if (followDate) {
      followDate.setHours(0, 0, 0, 0);
      if (followDate.getTime() === today.getTime()) statusType = "Due Today";
      else if (followDate < today) statusType = "Overdue";
      else statusType = "Upcoming";
    }

    return { ...r, statusType };
  });

  const filteredRows = useMemo(() => {
    return rowsWithState.filter((r) => {
      const matchesStatus =
        statusFilter === "All" ? true : r.status === statusFilter;
      const matchesState =
        stateFilter === "All" ? true : r.statusType === stateFilter;
      const matchesSearch =
        r.name.toLowerCase().includes(searchText.toLowerCase()) ||
        r.company.toLowerCase().includes(searchText.toLowerCase());

      return matchesStatus && matchesState && matchesSearch;
    });
  }, [rowsWithState, statusFilter, stateFilter, searchText]);

  const itemsPerPage = 5;
  const start = (page - 1) * itemsPerPage;
  const paginatedRows = filteredRows.slice(start, start + itemsPerPage);
  const totalPagesCalculated = Math.ceil(filteredRows.length / itemsPerPage);

  const columns = [
    { key: "name", label: "Name" },
    { key: "profileLink", label: "LinkedIn / Email" },
    { key: "company", label: "Company" },
    { key: "role", label: "Role" },
    { key: "lastMessage", label: "Last Message" },
    { key: "nextFollowUpDate", label: "Next Follow Up" },
    { key: "status", label: "Status" },
    { key: "statusType", label: "Followup State" },
  ];

  return (
    <div className="space-y-6 p-6 relative">
      {/* stat cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Contacts"
          value={allContacts.length}
          accentColor="border-indigo-500"
        />

        <StatCard
          title="New Contacts (7 Days)"
          value={
            allContacts.filter((c) => {
              const created = new Date(c.createdAt);
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              return created >= sevenDaysAgo;
            }).length
          }
          accentColor="border-emerald-500"
        />

        <StatCard
          title="Follow Ups Today"
          value={
            rowsWithState.filter((r) => r.statusType === "Due Today").length
          }
          accentColor="border-sky-500"
        />

        <StatCard
          title="Overdue"
          value={rowsWithState.filter((r) => r.statusType === "Overdue").length}
          accentColor="border-rose-500"
        />

        <StatCard
          title="Pending Replies"
          value={rows.filter((r) => r.status === "Pending Reply").length}
          accentColor="border-amber-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 relative">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Search by Name or Company
          </label>
          <Input
            placeholder="Type name or company..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="relative" ref={statusDropdown.ref}>
          <label className="block text-sm font-medium mb-1">
            Filter By Status
          </label>
          <SelectTrigger
            onClick={statusDropdown.toggle}
            isOpen={statusDropdown.isOpen}
            className="w-48"
          >
            <SelectValue>{statusFilter}</SelectValue>
          </SelectTrigger>

          <SelectContent isOpen={statusDropdown.isOpen}>
            {["All", "Follow-Up", "Pending Reply"].map((s) => (
              <SelectItem
                key={s}
                value={s}
                onSelect={(v) => {
                  setStatusFilter(v);
                  statusDropdown.setIsOpen(false);
                }}
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </div>

        {/* Followup State Filter */}
        <div className="relative" ref={stateDropdown.ref}>
          <label className="block text-sm font-medium mb-1">
            Filter By State
          </label>
          <SelectTrigger
            onClick={stateDropdown.toggle}
            isOpen={stateDropdown.isOpen}
            className="w-48"
          >
            <SelectValue>{stateFilter}</SelectValue>
          </SelectTrigger>

          <SelectContent isOpen={stateDropdown.isOpen}>
            {["All", "Overdue", "Upcoming", "Due Today"].map((s) => (
              <SelectItem
                key={s}
                value={s}
                onSelect={(v) => {
                  setStateFilter(v);
                  stateDropdown.setIsOpen(false);
                }}
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={paginatedRows}
        pagination={true}
        page={page}
        totalPages={totalPagesCalculated}
        onPageChange={(p) => setPage(p)}
        onEdit={handleEdit}
        categories={categories}
      />

      <AddContactModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContact(null);
        }}
        editData={editingContact} // pass row here
        onSuccess={() => {
          fetchContacts(); // refresh
        }}
      />
    </div>
  );
}
