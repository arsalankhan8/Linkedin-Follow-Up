import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UpcomingTable({ data = [], page = 1, totalPages = 5, onPageChange }) {
  const mockData = data.length ? data : [
    {
      name: "John Doe",
      contact: "linkedin.com/john",
      company: "Meta",
      status: "Pending",
      nextFollowUp: "Nov 03, 2025",
    },
    {
      name: "Sarah Khan",
      contact: "sarah@email.com",
      company: "Google",
      status: "Follow-up",
      nextFollowUp: "Nov 04, 2025",
    },
    {
      name: "Ali Raza",
      contact: "linkedin.com/razi",
      company: "Apple",
      status: "Completed",
      nextFollowUp: "Oct 30, 2025",
    },
  ];

  function StatusBadge({ status }) {
    const color =
      status === "Completed"
        ? "bg-green-100 text-green-700"
        : status === "Pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-blue-100 text-blue-700";

    return <Badge className={`${color} rounded-md`}>{status}</Badge>;
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">LinkedIn / Email</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Next Follow-up</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {mockData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">{row.contact}</td>
                  <td className="p-3">{row.company}</td>
                  <td className="p-3"><StatusBadge status={row.status} /></td>
                  <td className="p-3">{row.nextFollowUp}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button onClick={() => console.log('done clicked', row)}>✓</button>
                    <button onClick={() => console.log('edit clicked', row)}>✎</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center py-4 gap-3">
          <Button variant="outline" disabled={page === 1} onClick={() => onPageChange?.(page - 1)}>Prev</Button>
          <span className="px-2">{page} / {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => onPageChange?.(page + 1)}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}