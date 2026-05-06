"use client";

import { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/PriorityBadge";
import { MemberAvatar } from "@/components/MemberAvatar";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { useTaskStore } from "@/store/useTaskStore";
import type { Task } from "@/types";

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  const { members, deleteTask } = useTaskStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const assignee = members.find((m) => m.id === task.assigneeId);
  const isOverdue =
    task.dueDate && task.status !== "done" && isPast(parseISO(task.dueDate));

  return (
    <>
      <Card className="group shadow-sm hover:shadow-md transition-shadow cursor-default">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">
              {task.title}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                }
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <PriorityBadge priority={task.priority} />
            <div className="flex items-center gap-2 ml-auto">
              {task.dueDate && (
                <span
                  className={`flex items-center gap-0.5 text-xs ${
                    isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"
                  }`}
                >
                  <CalendarDays className="w-3 h-3" />
                  {format(parseISO(task.dueDate), "M/d", { locale: ko })}
                </span>
              )}
              {assignee && <MemberAvatar member={assignee} />}
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>일감을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{task.title}&rdquo; 일감이 영구 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteTask(task.id)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
