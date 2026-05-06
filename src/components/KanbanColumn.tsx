"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import type { Status, Task } from "@/types";
import { STATUS_LABELS } from "@/types";

const COLUMN_COLORS: Record<Status, string> = {
  todo: "bg-slate-100 border-slate-200",
  in_progress: "bg-blue-50 border-blue-200",
  review: "bg-amber-50 border-amber-200",
  done: "bg-green-50 border-green-200",
};

const HEADER_COLORS: Record<Status, string> = {
  todo: "bg-slate-200 text-slate-700",
  in_progress: "bg-blue-200 text-blue-800",
  review: "bg-amber-200 text-amber-800",
  done: "bg-green-200 text-green-800",
};

interface Props {
  status: Status;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: Props) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <div
        className={`flex flex-col rounded-xl border ${COLUMN_COLORS[status]} min-h-[300px] w-72 shrink-0`}
      >
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${HEADER_COLORS[status]}`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{STATUS_LABELS[status]}</span>
            <span className="text-xs font-medium opacity-60 tabular-nums">
              {tasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-white/40"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 p-2 flex-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">일감 없음</p>
            </div>
          )}
        </div>
      </div>

      <TaskFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        defaultStatus={status}
      />
    </>
  );
}
