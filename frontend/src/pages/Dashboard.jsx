// src/pages/Dashboard.jsx
import React from "react";
import { CalendarCheck, CalendarRange, Hourglass, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "../components/DataTable.jsx"; // global DataTable you created

// Small stat card used on top of dashboard
const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className="w-6 h-6" />
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  // demo rows (use the human-readable format you requested)

const rows = [
  {
    id: 1,
    name: "John Doe",
    contact: "linkedin.com/john",
    company: "Meta",
    nextFollowUpDate: "Nov 03, 2025",
  },
  {
    id: 2,
    name: "Sarah Khan",
    contact: "sarah@email.com",
    company: "Google",
    nextFollowUpDate: "Nov 04, 2025",
  },
  {
    id: 3,
    name: "Ali Raza",
    contact: "linkedin.com/razi",
    company: "Apple",
    nextFollowUpDate: "Oct 30, 2025",
  },
];


  // columns expected by DataTable (keys must match row fields)
const columns = [
  { key: "name", label: "Name" },
  { key: "contact", label: "LinkedIn / Email" },
  { key: "company", label: "Company" },
  { key: "nextFollowUpDate", label: "Next Follow Up" },
  { key: "statusType", label: "Status" } // this will show the badge auto computed
];

  // simple pagination state (hook into real API later)
  const [page, setPage] = React.useState(1);
  const totalPages = 3;

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} title="Today Follow-ups" value={12} />
        <StatCard icon={CalendarRange} title="Upcoming (7 days)" value={43} />
        <StatCard icon={Hourglass} title="Pending" value={18} />
        <StatCard icon={CheckCircle2} title="Completed" value={77} />
      </div>

      {/* DataTable - using the global table; pass columns, rows and pagination handlers */}
      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
