"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Task, Member, Status, Priority } from "@/types";
import { MEMBER_COLORS } from "@/types";

interface TaskStore {
  tasks: Task[];
  members: Member[];

  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;

  addMember: (name: string) => void;
  updateMember: (id: string, name: string) => void;
  deleteMember: (id: string) => void;
}

const SEED_MEMBERS: Member[] = [
  { id: "m1", name: "김철수", color: MEMBER_COLORS[0] },
  { id: "m2", name: "이영희", color: MEMBER_COLORS[1] },
  { id: "m3", name: "박민준", color: MEMBER_COLORS[2] },
];

const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "요구사항 분석",
    description: "고객 요구사항 문서를 검토하고 기능 목록을 정리합니다.",
    status: "done",
    priority: "high",
    assigneeId: "m1",
    dueDate: "2026-05-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "UI 디자인 시안 작성",
    description: "피그마로 주요 화면 와이어프레임을 작성합니다.",
    status: "done",
    priority: "medium",
    assigneeId: "m2",
    dueDate: "2026-05-03",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "API 설계",
    description: "REST API 엔드포인트 명세를 작성합니다.",
    status: "review",
    priority: "high",
    assigneeId: "m1",
    dueDate: "2026-05-07",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t4",
    title: "프론트엔드 개발",
    description: "Next.js로 메인 페이지 및 대시보드를 구현합니다.",
    status: "in_progress",
    priority: "urgent",
    assigneeId: "m3",
    dueDate: "2026-05-10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t5",
    title: "백엔드 API 구현",
    description: "Node.js로 인증 및 데이터 CRUD API를 구현합니다.",
    status: "in_progress",
    priority: "high",
    assigneeId: "m1",
    dueDate: "2026-05-12",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t6",
    title: "데이터베이스 스키마 설계",
    description: "PostgreSQL 테이블 구조를 설계하고 마이그레이션을 작성합니다.",
    status: "todo",
    priority: "medium",
    assigneeId: "m2",
    dueDate: "2026-05-08",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t7",
    title: "테스트 코드 작성",
    description: "Jest와 Playwright로 단위/E2E 테스트를 작성합니다.",
    status: "todo",
    priority: "low",
    assigneeId: "m3",
    dueDate: "2026-05-15",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t8",
    title: "배포 파이프라인 구성",
    description: "GitHub Actions CI/CD 파이프라인을 구성합니다.",
    status: "todo",
    priority: "medium",
    assigneeId: null,
    dueDate: "2026-05-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: SEED_TASKS,
      members: SEED_MEMBERS,

      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      addMember: (name) =>
        set((state) => {
          const usedColors = state.members.map((m) => m.color);
          const color =
            MEMBER_COLORS.find((c) => !usedColors.includes(c)) ??
            MEMBER_COLORS[state.members.length % MEMBER_COLORS.length];
          return {
            members: [...state.members, { id: uuidv4(), name, color }],
          };
        }),

      updateMember: (id, name) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, name } : m)),
        })),

      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          tasks: state.tasks.map((t) =>
            t.assigneeId === id ? { ...t, assigneeId: null } : t
          ),
        })),
    }),
    { name: "team-tasks-store" }
  )
);
