import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types";
import { PRIORITY_LABELS } from "@/types";

const COLOR: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={`text-xs ${COLOR[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
