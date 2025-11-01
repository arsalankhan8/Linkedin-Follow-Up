import React from "react";
import { Link, NavLink } from "react-router-dom"; // assume react-router usage
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator.jsx";
import { Home, Users, Settings, Menu, Bell } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

// -----------------------------
// Sidebar component
// -----------------------------

export function Sidebar({ className = "", collapsed = false }) {
  const nav = [
    { name: "Dashboard", to: "/dashboard", icon: Home },
    { name: "Contacts", to: "/contacts", icon: Users },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 p-4 flex flex-col ${className}`}
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

export function Topbar({ onToggleSidebar }) {
    const user = useUserStore((s) => s.user);
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
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-md hover:bg-slate-50"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-rose-600 text-white">
            3
          </span>
        </button>

        <div className="hidden sm:flex items-center gap-2">
        <Avatar>
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        </div>
      </div>
    </header>
  );
}

// -----------------------------
// DashboardLayout (default export)
// -----------------------------

export default function DashboardLayout({ children }) {
  const [showSidebar, setShowSidebar] = React.useState(true);

  function toggleSidebar() {
    setShowSidebar((s) => !s);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Sidebar (boxed style) */}
          <div
            className={`${showSidebar ? "block" : "hidden"} hidden md:block`}
          >
            <Sidebar />
          </div>

          <main className="flex-1 p-6">
            <Topbar onToggleSidebar={toggleSidebar} />

            {/* Boxed content wrapper */}
            <div className="max-w-6xl mx-auto">
              {/* Page inner card / container */}
              <div className="space-y-6 mt-6">
                <Outlet />

              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

/*
  USAGE
  -----
  Place this file at: src/components/layout/DashboardLayout.jsx
  Import and use in your App.jsx / routes like:

  <DashboardLayout>
    <DashboardPage />
  </DashboardLayout>

  DEPENDENCIES (install before using):
  - shadcn components and styles (as you already plan)
  - lucide-react
  - react-router-dom (for NavLink)

  npm install lucide-react react-router-dom

  Adjust import paths for shadcn components depending on how you scaffolded shadcn.
*/
