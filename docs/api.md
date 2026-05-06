# API Endpoints — team-tasks

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 흐름 시작, 리디렉트 URL 반환 | 불필요 |
| GET | /api/auth/callback | OAuth 콜백 처리 후 세션 쿠키 발급 | 불필요 |
| GET | /api/tasks | 로그인 사용자 업무 목록 조회 (status · date 쿼리 필터 지원) | 필요 |
| POST | /api/tasks | 업무 생성 (title · assignee_id 수신) | 필요 |
| GET | /api/tasks/[id] | 업무 단건 상세 조회 | 필요 |
| PATCH | /api/tasks/[id] | 업무 상태(status) 또는 제목(title) 수정 | 필요 |
| DELETE | /api/tasks/[id] | 업무 삭제 | 필요 |
