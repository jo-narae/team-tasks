"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStore } from "@/store/useTaskStore";
import type { Task, Status, Priority } from "@/types";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultStatus?: Status;
}

const EMPTY: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assigneeId: null,
  dueDate: null,
};

export function TaskFormDialog({ open, onClose, task, defaultStatus }: Props) {
  const { addTask, updateTask, members } = useTaskStore();
  const [form, setForm] = useState({ ...EMPTY });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
      });
    } else {
      setForm({ ...EMPTY, status: defaultStatus ?? "todo" });
    }
  }, [task, defaultStatus, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (task) {
      updateTask(task.id, form);
    } else {
      addTask(form);
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "일감 수정" : "새 일감 추가"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">제목 *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="일감 제목을 입력하세요"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">설명</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="상세 내용을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">상태</label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as Status })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">우선순위</label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">담당자</label>
              <Select
                value={form.assigneeId ?? "none"}
                onValueChange={(v) =>
                  setForm({ ...form, assigneeId: v === "none" ? null : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="미배정" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">미배정</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">마감일</label>
              <Input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value || null })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">{task ? "저장" : "추가"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
