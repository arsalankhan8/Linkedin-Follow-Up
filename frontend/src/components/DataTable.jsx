// src/components/DataTable.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, Pen } from "lucide-react";

/**
 * tryParseDate - robustly parse a date string that may be:
 * - ISO 'YYYY-MM-DD'
 * - human 'Nov 03, 2025'
 * - full ISO with time
 *
 * Returns a Date object or null if invalid.
 */
function tryParseDate(value) {
  if (!value && value !== 0) return null;

  // If already a Date
  if (value instanceof Date && !isNaN(value)) return value;

  // First try native parsing
  const d = new Date(value);
  if (!isNaN(d)) return d;

  // Fallback: try to normalize common patterns like 'Nov 03, 2025' or '03 Nov 2025'
  // Replace multiple spaces, remove ordinal suffixes if any (1st, 2nd, 3rd, 4th)
  try {
    const cleaned = String(value)
      .replace(/(\d+)(st|nd|rd|th)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    const d2 = new Date(cleaned);
    if (!isNaN(d2)) return d2;
  } catch (e) {
    // ignore and return null below
  }

  return null;
}

/**
 * formatDateNice - returns 'Mon DD, YYYY' for display when possible
 */

function formatDateNice(value) {
  const d = tryParseDate(value);
  if (!d) return value ?? "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d); // e.g. "Nov 03, 2025"
}

/**
 * computeFollowupState - compares nextFollowUpDate with local 'today'
 * returns one of: "Upcoming", "Due Today", "Overdue"
 */

function computeFollowupState(value) {
  const d = tryParseDate(value);
  if (!d) return ""; // unknown

  // local midnight compare
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);

  if (target > today) return "Upcoming";
  if (target.getTime() === today.getTime()) return "Due Today";
  return "Overdue";
}

/**
 * StatusBadge used for Followup State column (green/amber/rose)
 */

function StatusBadge({ state }) {
  if (!state) return null;

  let cls = "bg-emerald-500/15 text-emerald-600";
  if (state === "Due Today") cls = "bg-amber-500/15 text-amber-600";
  if (state === "Overdue") cls = "bg-rose-500/15 text-rose-600";

  return <Badge className={`${cls} rounded-md`}>{state}</Badge>;
}

export default function DataTable({
  columns = [],
  rows = [],
  page = 1,
  totalPages = 5,
  onPageChange,
}) {
  return (
    <Card className="mt-6">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="p-3 text-left">
                    {col.label}
                  </th>
                ))}
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id ?? i} className="border-b hover:bg-muted/30">
                  {columns.map((col) => {
                    // date display column (show the human-friendly date)
                    if (col.key === "nextFollowUpDate") {
                      return (
                        <td key={col.key} className="p-3">
                          {formatDateNice(row[col.key])}
                        </td>
                      );
                    }

                    // auto-computed followup state (badge)
                    if (col.key === "statusType" || col.key === "followupState" || col.key === "FollowupState") {
                      // we agreed on 'statusType' or 'Followup State' in columns — be tolerant
                      const state = computeFollowupState(row.nextFollowUpDate);
                      return (
                        <td key={col.key} className="p-3">
                          <StatusBadge state={state} />
                        </td>
                      );
                    }

                    // manual status (plain text) for Contacts page
                    if (col.key === "status") {
                      return (
                        <td key={col.key} className="p-3">
                          {row[col.key]}
                        </td>
                      );
                    }

                    // default cell
                    return (
                      <td key={col.key} className="p-3">
                        {row[col.key]}
                      </td>
                    );
                  })}

                  {/* Actions column (icons) */}
                  <td className="p-3 flex justify-center gap-3">
                    <CheckCircle2
                      className="cursor-pointer hover:opacity-80"
                      size={16}
                      onClick={() => console.log("done clicked", row)}
                      title="Mark done"
                    />
                    <Pen
                      className="cursor-pointer hover:opacity-80"
                      size={16}
                      onClick={() => console.log("edit clicked", row)}
                      title="Edit"
                    />
                    <RotateCcw
                      className="cursor-pointer hover:opacity-80"
                      size={16}
                      onClick={() => console.log("reschedule clicked", row)}
                      title="Reschedule"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center py-4 gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            Prev
          </Button>
          <span className="px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}