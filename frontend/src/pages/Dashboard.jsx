import { CalendarCheck, CalendarRange, Hourglass, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UpcomingTable from "../components/UpcomingTable.jsx";

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
  return (
    <div className="p-6 flex flex-col gap-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} title="Today Follow-ups" value={12} />
        <StatCard icon={CalendarRange} title="Upcoming (7 days)" value={43} />
        <StatCard icon={Hourglass} title="Pending" value={18} />
        <StatCard icon={CheckCircle2} title="Completed" value={77} />
      </div>

      <UpcomingTable />

    </div>
  );
}