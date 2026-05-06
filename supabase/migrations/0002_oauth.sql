-- ============================================================
-- 1. 컬럼 추가 (이미 존재하면 무시)
-- ============================================================
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS assignee_id uuid,
  ADD COLUMN IF NOT EXISTS created_by  uuid;

-- ============================================================
-- 2. 외래 키 제약 추가
--    assignee_id: 담당자 삭제 시 NULL로 (미배정 허용)
--    created_by : 생성자 삭제 시 행도 삭제 (cascade)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tasks_assignee_id_fkey'
      AND table_name = 'tasks'
  ) THEN
    ALTER TABLE public.tasks
      ADD CONSTRAINT tasks_assignee_id_fkey
        FOREIGN KEY (assignee_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tasks_created_by_fkey'
      AND table_name = 'tasks'
  ) THEN
    ALTER TABLE public.tasks
      ADD CONSTRAINT tasks_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================
-- 3. 인증 없이 생성된 기존 행 정리 후 created_by NOT NULL 강화
-- ============================================================
DELETE FROM public.tasks WHERE created_by IS NULL;

ALTER TABLE public.tasks
  ALTER COLUMN created_by SET NOT NULL;

-- ============================================================
-- 4. 임시 전체 허용 정책 제거
-- ============================================================
DROP POLICY IF EXISTS temp_all_access ON public.tasks;

-- ============================================================
-- 5. RLS 활성화 (이미 활성화된 경우 무해)
-- ============================================================
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. 정식 RLS 정책 4종
-- ============================================================

-- 조회: 본인이 생성했거나 본인에게 배정된 일감
CREATE POLICY tasks_select ON public.tasks
  FOR SELECT
  USING (
    auth.uid() = created_by
    OR auth.uid() = assignee_id
  );

-- 삽입: created_by가 본인이어야 함
CREATE POLICY tasks_insert ON public.tasks
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- 수정: 생성자 또는 담당자
CREATE POLICY tasks_update ON public.tasks
  FOR UPDATE
  USING (
    auth.uid() = created_by
    OR auth.uid() = assignee_id
  );

-- 삭제: 생성자만
CREATE POLICY tasks_delete ON public.tasks
  FOR DELETE
  USING (auth.uid() = created_by);
