"use client";

import { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PriorityBadge } from "@/components/PriorityBadge";
import { MemberAvatar } from "@/components/MemberAvatar";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { useTaskStore } from "@/store/useTaskStore";
import { STATUS_LABELS, PRIORITY_ORDER } from "@/types";
import type { Task, Status } from "@/types";

const STATUS_BADGE: Record<Status, string> = {
  todo: "bg-slate-100 text-slate-600 border-slate-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  review: "bg-amber-100 text-amber-700 border-amber-200",
  done: "bg-green-100 text-green-700 border-green-200",
};

export function ListView() {
  const { tasks, members, deleteTask } = useTaskStore();
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterMember, setFilterMember] = useState<string>("all");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const filtered = tasks
    .filter((t) => filterStatus === "all" || t.status === filterStatus)
    .filter((t) => filterMember === "all" || t.assigneeId === filterMember)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as Status | "all")}
        >
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterMember}
          onValueChange={(v) => setFilterMember(v ?? "all")}
        >
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 담당자</SelectItem>
            <SelectItem value="none">미배정</SelectItem>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground self-center ml-auto">
          {filtered.length}건
        </span>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">제목</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">상태</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">우선순위</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden lg:table-cell">담당자</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden lg:table-cell">마감일</th>
              <th className="w-16" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  일감이 없습니다.
                </td>
              </tr>
            )}
            {filtered.map((task) => {
              const assignee = members.find((m) => m.id === task.assigneeId);
              const isOverdue =
                task.dueDate &&
                task.status !== "done" &&
                isPast(parseISO(task.dueDate));
              return (
                <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <Badge variant="outline" className={`text-xs ${STATUS_BADGE[task.status]}`}>
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    {assignee ? (
                      <div className="flex items-center gap-1.5">
                        <MemberAvatar member={assignee} />
                        <span>{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">미배정</span>
                    )}
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    {task.dueDate ? (
                      <span
                        className={`flex items-center gap-1 text-xs ${
                          isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"
                        }`}
                      >
                        <CalendarDays className="w-3 h-3" />
                        {format(parseISO(task.dueDate), "yyyy. M. d.", { locale: ko })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditTask(task)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600"
                        onClick={() => setDeleteTarget(task)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TaskFormDialog
        open={!!editTask}
        onClose={() => setEditTask(null)}
        task={editTask}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>일감을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; 일감이 영구 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteTarget) deleteTask(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
