"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatsCards } from "@/components/StatsCards";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ListView } from "@/components/ListView";
import { MembersPanel } from "@/components/MembersPanel";
import { TaskFormDialog } from "@/components/TaskFormDialog";

export default function Home() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h1 className="font-bold text-base tracking-tight">팀 일감 관리</h1>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            새 일감
          </Button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsCards />

        {/* Main content */}
        <Tabs defaultValue="kanban" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="kanban" className="text-xs gap-1.5 h-6 px-3">
                <LayoutGrid className="w-3.5 h-3.5" />
                칸반
              </TabsTrigger>
              <TabsTrigger value="list" className="text-xs gap-1.5 h-6 px-3">
                <List className="w-3.5 h-3.5" />
                목록
              </TabsTrigger>
              <TabsTrigger value="members" className="text-xs gap-1.5 h-6 px-3">
                <Users className="w-3.5 h-3.5" />
                팀원
              </TabsTrigger>
            </TabsList>
          </div>

          <Separator />

          <TabsContent value="kanban" className="mt-0">
            <KanbanBoard />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <ListView />
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <div className="max-w-sm">
              <h2 className="text-sm font-semibold mb-3">팀원 관리</h2>
              <MembersPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <TaskFormDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
