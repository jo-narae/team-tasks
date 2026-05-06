"use client";

import { CheckCircle2, Circle, Loader2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/store/useTaskStore";

export function StatsCards() {
  const { tasks } = useTaskStore();

  const stats = [
    {
      label: "전체",
      value: tasks.length,
      icon: <Circle className="w-4 h-4 text-slate-400" />,
      color: "text-slate-600",
    },
    {
      label: "진행 중",
      value: tasks.filter((t) => t.status === "in_progress").length,
      icon: <Loader2 className="w-4 h-4 text-blue-500" />,
      color: "text-blue-600",
    },
    {
      label: "검토",
      value: tasks.filter((t) => t.status === "review").length,
      icon: <Eye className="w-4 h-4 text-amber-500" />,
      color: "text-amber-600",
    },
    {
      label: "완료",
      value: tasks.filter((t) => t.status === "done").length,
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            {s.icon}
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${s.color}`}>
                {s.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
