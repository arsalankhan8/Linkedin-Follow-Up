// src/pages/Dashboard.jsx
import React from "react";
import { CalendarCheck, CalendarRange, Hourglass, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "../components/DataTable.jsx"; // global DataTable you created
import { getContacts } from "@/api/contact.js";
import { useState, useEffect } from "react";
import AddContactModal from "../components/AddContactModal.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import { getCategoriesWithTemplates } from "../utils/templates";

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

  // ✅ State for contacts (API data)
  const [contacts, setContacts] = useState([]); // paginated data
  const [allContacts, setAllContacts] = useState([]); // full list for stats
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState(getCategoriesWithTemplates );


  // ✅ Fetch contacts from backend API

  const fetchContacts = async () => {
    try {
      setLoading(true);
    const res = await getContacts({ limit: 7, page: 1 });
    setAllContacts(res.data.contacts);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mapped = (res.data.contacts || []).map((c) => {
        const d = new Date(c.nextFollowUpDate);
        d.setHours(0, 0, 0, 0);

        let state;
        if (d > today) state = "Upcoming";
        else if (d.getTime() === today.getTime()) state = "Due Today";
        else state = "Overdue";

        return { ...c, statusType: state };
      });

      setContacts(mapped);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCount = contacts.filter(c => {
    const d = new Date(c.nextFollowUpDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;

  const upcomingCount = contacts.filter(c => {
    const d = new Date(c.nextFollowUpDate);
    return d > today;
  }).length;

  const pendingCount = contacts.filter(c => c.status === "Pending").length;
  const completedCount = contacts.filter(c => c.status === "Completed").length;


  useEffect(() => {
    fetchContacts();

    // ✅ Listen for contactAdded events from modal
    const handleContactAdded = () => {
      fetchContacts();
    };

    window.addEventListener("contactAdded", handleContactAdded);

    return () => {
      window.removeEventListener("contactAdded", handleContactAdded);
    };
  }, []);

  // simple pagination state (hook into real API later)

  const columns = [
    { key: "name", label: "Name" },
    { key: "profileLink", label: "LinkedIn / Email" },
    { key: "company", label: "Company" },
    { key: "nextFollowUpDate", label: "Next Follow Up" },
    { key: "statusType", label: "Status" },
  ];

  return (
    <div className="p-6 flex flex-col gap-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} title="Today Follow-ups" value={todayCount} />
        <StatCard icon={CalendarRange} title="Upcoming (7 days)" value={upcomingCount} />
        <StatCard icon={Hourglass} title="Pending" value={pendingCount} />
        <StatCard icon={CheckCircle2} title="Completed" value={completedCount} />

      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading contacts...</div>
      ) : (
        <DataTable columns={columns} rows={contacts} pagination={false}   categories={categories} />

      )}

    </div>
  );
}