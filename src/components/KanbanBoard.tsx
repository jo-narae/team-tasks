"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { KanbanColumn } from "@/components/KanbanColumn";
import type { Status } from "@/types";
import { PRIORITY_ORDER } from "@/types";

const COLUMNS: Status[] = ["todo", "in_progress", "review", "done"];

export function KanbanBoard() {
  const { tasks } = useTaskStore();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((status) => {
        const columnTasks = tasks
          .filter((t) => t.status === status)
          .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        return (
          <KanbanColumn key={status} status={status} tasks={columnTasks} />
        );
      })}
    </div>
  );
}
