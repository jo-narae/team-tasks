export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "in_progress" | "review" | "done";

export interface Member {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<Status, string> = {
  todo: "할 일",
  in_progress: "진행 중",
  review: "검토",
  done: "완료",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "긴급",
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const MEMBER_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
  "#3b82f6",
];
