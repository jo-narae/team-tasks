"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemberAvatar } from "@/components/MemberAvatar";
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
import { useTaskStore } from "@/store/useTaskStore";

export function MembersPanel() {
  const { members, tasks, addMember, updateMember, deleteMember } = useTaskStore();
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    addMember(newName.trim());
    setNewName("");
  }

  function startEdit(id: string, name: string) {
    setEditId(id);
    setEditName(name);
  }

  function confirmEdit() {
    if (editId && editName.trim()) {
      updateMember(editId, editName.trim());
    }
    setEditId(null);
  }

  const deleteTarget = members.find((m) => m.id === deleteId);
  const deleteTaskCount = tasks.filter((t) => t.assigneeId === deleteId).length;

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="이름 입력"
          className="h-8 text-sm"
        />
        <Button type="submit" size="sm" className="h-8 shrink-0">
          <Plus className="w-3.5 h-3.5 mr-1" />
          추가
        </Button>
      </form>

      <ul className="space-y-1.5">
        {members.map((member) => {
          const count = tasks.filter((t) => t.assigneeId === member.id).length;
          return (
            <li
              key={member.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50 group"
            >
              <MemberAvatar member={member} />
              {editId === member.id ? (
                <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-6 text-sm flex-1 py-0 px-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmEdit();
                      if (e.key === "Escape") setEditId(null);
                    }}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={confirmEdit}
                  >
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => setEditId(null)}
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium flex-1">{member.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {count}건
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => startEdit(member.id, member.name)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                    onClick={() => setDeleteId(member.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>팀원을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.name}&rdquo;을(를) 삭제합니다.
              {deleteTaskCount > 0 && (
                <> 담당 일감 {deleteTaskCount}건의 담당자가 미배정으로 변경됩니다.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteId) deleteMember(deleteId);
                setDeleteId(null);
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
