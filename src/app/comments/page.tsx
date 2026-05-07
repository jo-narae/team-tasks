"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Tables } from "@/lib/database.types";

type Comment = Tables<"comments">;

export default function CommentsPage() {
  const [taskId, setTaskId] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchComments() {
    if (!taskId.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/comments?task_id=${encodeURIComponent(taskId.trim())}`);
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    if (taskId.trim()) fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  async function addComment() {
    if (!content.trim() || !taskId.trim()) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: taskId.trim(), content }),
    });
    if (res.ok) {
      setContent("");
      toast.success("댓글이 추가되었습니다");
      fetchComments();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "오류가 발생했습니다");
    }
  }

  async function saveEdit(id: string) {
    if (!editContent.trim()) return;
    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent.trim() }),
    });
    if (res.ok) {
      setEditingId(null);
      toast.success("댓글이 수정되었습니다");
      fetchComments();
    } else {
      toast.error("수정에 실패했습니다");
    }
  }

  async function deleteComment(id: string) {
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("댓글이 삭제되었습니다");
      fetchComments();
    } else {
      toast.error("삭제에 실패했습니다");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">댓글 관리</h1>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">일감 ID</label>
        <Input
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          placeholder="task_id를 입력하세요"
        />
      </div>

      {taskId.trim() && (
        <>
          <div className="flex gap-2">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              placeholder="댓글 내용"
            />
            <Button onClick={addComment}>추가</Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">불러오는 중…</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">댓글이 없습니다</p>
          ) : (
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-lg border p-3 space-y-2">
                  {editingId === comment.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(comment.id)}
                        autoFocus
                      />
                      <Button size="sm" onClick={() => saveEdit(comment.id)}>저장</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>취소</Button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <p className="flex-1 text-sm">{comment.content}</p>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteComment(comment.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString("ko-KR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
