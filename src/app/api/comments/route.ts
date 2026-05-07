import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const taskId = searchParams.get("task_id");

  let query = supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: true });

  if (taskId) query = query.eq("task_id", taskId);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const { task_id, content } = body;

  if (!task_id) return Response.json({ error: "task_id는 필수입니다" }, { status: 400 });
  if (!content?.trim()) return Response.json({ error: "내용은 필수입니다" }, { status: 400 });

  const { data, error } = await supabase
    .from("comments")
    .insert({ task_id, content: content.trim(), created_by: user.id })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
