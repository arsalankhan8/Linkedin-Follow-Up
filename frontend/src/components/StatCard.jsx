import { Card } from "@/components/ui/card";

export default function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="p-4 flex items-center gap-4 border border-slate-200 shadow-sm rounded-xl">
      <div className="p-2 rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-700" />
      </div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-sm text-slate-600 font-medium">{label}</div>
      </div>
    </Card>
  );
}