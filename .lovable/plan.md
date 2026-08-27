# Theo dõi lượt xem của Tiên

Thêm cho admin một tab "Lượt xem" để biết có ai vào web không, vào lúc nào, và họ đã xem tới chương nào.

## Người dùng thấy gì

- Phía Tiên: hoàn toàn không đổi, không hiện gì cả.
- Phía admin: tab mới "Lượt xem" hiển thị
  - Tổng số lượt truy cập và số lượt trong 24 giờ qua
  - Lần cuối có người vào (ví dụ "3 phút trước")
  - Danh sách các phiên gần nhất: thời gian, thiết bị (điện thoại/máy tính), đã bấm "Bắt đầu hành trình" chưa, đã đọc tới mốc nào (Chương I → Tỏ tình → Quyết định), tổng thời gian ở lại
  - Nút xoá toàn bộ lịch sử để đếm lại từ đầu

## Cách hoạt động

Mỗi khi trang mở, site tạo một mã phiên ngẫu nhiên lưu trong sessionStorage rồi ghi nhận âm thầm các mốc: mở trang, bắt đầu hành trình, cuộn tới từng chương, trả lời tỏ tình. Không thu thập gì có thể định danh ngoài loại thiết bị.

## Chi tiết kỹ thuật

- Migration tạo bảng `public.visits`:
  - `id uuid`, `session_id text`, `event text`, `device text`, `created_at timestamptz default now()`
  - GRANT INSERT cho `anon` + `authenticated`; GRANT ALL cho `service_role`
  - RLS bật: policy INSERT `with check (true)`; SELECT/DELETE chỉ `has_role(auth.uid(), 'admin')` (GRANT SELECT, DELETE cho `authenticated`)
  - Index trên `created_at desc` và `session_id`
- `src/lib/content.functions.ts`:
  - `logVisit` (public, POST) — nhận `{ session_id, event, device }`, chỉ chấp nhận `event` trong danh sách cố định, ghi qua server publishable client
  - `listVisits` (`requireSupabaseAuth` + kiểm tra admin) — trả về các phiên đã gộp: mốc đầu/cuối, các event, thiết bị
  - `clearVisits` (admin) — xoá hết
- `src/hooks/useVisitTracker.ts`: sinh/đọc `session_id` trong sessionStorage, gọi `logVisit` một lần cho mỗi loại event, dùng IntersectionObserver cho các mốc chương
- Gắn hook vào `src/routes/index.tsx` (mở trang, bắt đầu hành trình, quyết định) và các section chính
- Tab mới `visits` trong `src/routes/_authenticated/admin.tsx`
