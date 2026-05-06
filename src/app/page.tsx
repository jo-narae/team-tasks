"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";

type Task = Tables<"tasks">;

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/login");
  }

  async function fetchTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask() {
    if (!title.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setTitle("");
      toast.success("일감이 추가되었습니다");
      fetchTasks();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "오류가 발생했습니다");
    }
  }

  async function toggleTask(task: Task) {
    const next = task.status === "todo" ? "done" : "todo";
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) fetchTasks();
    else toast.error("상태 변경에 실패했습니다");
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("일감이 삭제되었습니다");
      fetchTasks();
    } else {
      toast.error("삭제에 실패했습니다");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">팀 일감 관리</h1>
        {email && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="새 일감 제목"
        />
        <Button onClick={addTask}>추가</Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">불러오는 중…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">일감이 없습니다</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <input
                type="checkbox"
                checked={task.status === "done"}
                onChange={() => toggleTask(task)}
                className="h-4 w-4 cursor-pointer"
              />
              <span
                className={`flex-1 text-sm ${
                  task.status === "done"
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {task.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                className="text-destructive hover:text-destructive"
              >
                삭제
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
