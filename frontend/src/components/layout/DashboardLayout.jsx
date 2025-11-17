// components > layout > DashboardLayout.jsx 

import React from "react";
import { Link, NavLink } from "react-router-dom"; // assume react-router usage
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator.jsx";
import { Home, Users, Settings, Menu, Bell, FileText } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import AddContactModal from "@/components/AddContactModal.jsx"

// -----------------------------
// Sidebar component
// -----------------------------

export function Sidebar({ className = "", collapsed = false }) {
  const nav = [
    { name: "Dashboard", to: "/dashboard", icon: Home },
    { name: "Contacts", to: "/contacts", icon: Users },
    { name: "Templates", to: "/templates", icon: FileText },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`w-64 bg-white h-screen border-r border-slate-200 p-4 flex flex-col ${className}`}
      aria-label="Sidebar"
    >
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="text-xl font-semibold">FollowUpFlow</div>
      </div>

      <Separator className="my-3" />

      <nav className="flex-1">
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ` +
                    (isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50")
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-4">
        <Separator className="mb-3" />
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar-placeholder.png" alt="User avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">Product Owner</div>
            <div className="text-xs text-slate-500">you@company.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// -----------------------------
// Topbar component
// -----------------------------

export function Topbar({ onToggleSidebar, title = "Dashboard", action }) {
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);

  function getAvatarSrc() {
    if (!user?.avatar) return null;

    // 1️⃣ Google avatar (http URL)
    if (user.avatar.startsWith("http")) {
      // fix size issue for Google avatars
      const baseUrl = user.avatar.split("=")[0]; // remove existing size
      return `${baseUrl}=s200`; // default 200px size
    }

    // 2️⃣ S3 avatar (stored as key)
    if (import.meta.env.VITE_S3_BUCKET && import.meta.env.VITE_AWS_REGION) {
      return `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${user.avatar}`;
    }

    // 3️⃣ fallback
    return null;
  }


  const getFallbackInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 bg-transparent">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* dynamic actions area - will show Add Contact btn only on contacts page */}
        {action}

        <button
          aria-label="Notifications"
          className="relative p-2 rounded-md hover:bg-slate-50"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-rose-600 text-white">
            3
          </span>
        </button>

        {!loading && user && (
          <div className="flex items-center gap-2">
            <Avatar key={user?.avatar || user?.id}>
              <AvatarImage src={getAvatarSrc() || undefined} />
              <AvatarFallback>{getFallbackInitial()}</AvatarFallback>
            </Avatar>

          </div>
        )}
      </div>
    </header>
  );
}

// -----------------------------
// DashboardLayout (default export)
// -----------------------------

export default function DashboardLayout({ children, title, action, onContactAdded }) {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [openAddContact, setOpenAddContact] = React.useState(false);

  function toggleSidebar() {
    setShowSidebar((s) => !s);
  }

  // Add contact button (only visible on desktop normally; you already used action prop)
  const addContactButton = (
    <Button onClick={() => setOpenAddContact(true)} className="hidden md:inline-flex">
      Add Contact
    </Button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-8xl mx-auto">
        <div className="flex">
          <div className={`${showSidebar ? "block" : "hidden"} hidden md:block`}>
            <Sidebar />
          </div>

          <main className="flex-1 p-6">
            {/* pass the addContactButton as Topbar action (it will render alongside notifications) */}
            <Topbar onToggleSidebar={toggleSidebar} title={title} action={addContactButton} />

            <div className="max-w-8xl mx-auto">
              <div className="space-y-6 mt-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal mounted at layout level — ensures it is available on Dashboard */}
      <AddContactModal
        open={openAddContact}
        onClose={() => setOpenAddContact(false)}
        onSuccess={(data) => {
          onContactAdded?.();
        }}
      />
    </div>
  );
}
