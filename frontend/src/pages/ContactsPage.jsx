// src/pages/ContactsPage.jsx
import React, { useState, useMemo } from "react";
import DataTable from "../components/DataTable.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  useDropdown,
} from "../components/ui/select.jsx";

const StatCard = ({ title, value }) => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All"); // default all
  const [stateFilter, setStateFilter] = useState("All"); // default all
  const [searchText, setSearchText] = useState("");

  const statusDropdown = useDropdown();
  const stateDropdown = useDropdown();

  const rows = [
    {
      id: 1,
      name: "John Doe",
      contact: "linkedin.com/john",
      company: "Meta",
      role: "Hiring Manager",
      lastMessage: "Sent profile intro",
      nextFollowUpDate: "2025-11-03",
      status: "Pending Reply",
    },
    {
      id: 2,
      name: "Sarah Khan",
      contact: "sarah@email.com",
      company: "Google",
      role: "Recruiter",
      lastMessage: "She asked for CV update",
      nextFollowUpDate: "2025-11-02",
      status: "Follow-Up",
    },
    {
      id: 3,
      name: "Ali Raza",
      contact: "linkedin.com/razi",
      company: "Apple",
      role: "Recruiter",
      lastMessage: "Waiting for response",
      nextFollowUpDate: "2025-10-30",
      status: "Follow-Up",
    },
  ];

  const today = new Date().toISOString().slice(0, 10);
  const rowsWithState = rows.map((r) => {
    let state;
    if (r.nextFollowUpDate > today) state = "Upcoming";
    else if (r.nextFollowUpDate === today) state = "Due Today";
    else state = "Overdue";
    return { ...r, statusType: state };
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

  const columns = [
    { key: "name", label: "Name" },
    { key: "contact", label: "LinkedIn / Email" },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Contacts" value={rows.length} />
        <StatCard
          title="Follow Ups Today"
          value={rows.filter((r) => r.nextFollowUpDate === today).length}
        />
        <StatCard
          title="Pending Replies"
          value={rows.filter((r) => r.status === "Pending Reply").length}
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
        <div className="relative">
          <label className="block text-sm font-medium mb-1">
            Filter By Status
          </label>
          <SelectTrigger onClick={statusDropdown.toggle} className="w-48">
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
        <div className="relative">
          <label className="block text-sm font-medium mb-1">
            Filter By State
          </label>
          <SelectTrigger onClick={stateDropdown.toggle} className="w-48">
            <SelectValue>{stateFilter}</SelectValue>
          </SelectTrigger>
          <SelectContent isOpen={stateDropdown.isOpen}>
            {["All", "Upcoming", "Due Today", "Overdue"].map((s) => (
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
        rows={filteredRows}
        page={page}
        totalPages={1}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
