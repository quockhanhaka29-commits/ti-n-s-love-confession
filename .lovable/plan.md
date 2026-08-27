# Ghi nhận truy cập website

Cho admin biết có ai đã vào xem website hay không — đơn giản nhất có thể.

## Người dùng thấy gì

- Phía Tiên: hoàn toàn không đổi, không thấy gì cả.
- Phía admin: tab mới "Lượt xem" hiển thị:
  - Tổng số lượt truy cập
  - Lần truy cập gần nhất (ví dụ "5 phút trước")
  - Danh sách từng lượt: thời gian + thiết bị (điện thoại / máy tính)
  - Nút xoá lịch sử để đếm lại từ đầu

## Cách hoạt động

Mỗi lần trang tải xong, site âm thầm ghi lại 1 lượt truy cập. Không theo dõi cuộn, không đếm chương, không thu thập thông tin cá nhân nào ngoài loại thiết bị.

## Chi tiết kỹ thuật

- Migration tạo bảng `public.visits`:
  - `id uuid default gen_random_uuid()`, `device text`, `created_at timestamptz default now()`
  - GRANT INSERT cho `anon` + `authenticated`; GRANT SELECT, DELETE cho `authenticated`; GRANT ALL cho `service_role`
  - Bật RLS: policy INSERT `with check (true)`; policy SELECT và DELETE chỉ `has_role(auth.uid(), 'admin')`
- `src/lib/content.functions.ts`:
  - `logVisit` (public, POST) — nhận `{ device }`, ghi 1 dòng qua server publishable client
  - `listVisits` (`requireSupabaseAuth`, kiểm tra admin) — trả về danh sách lượt mới nhất (giới hạn 100)
  - `clearVisits` (admin) — xoá toàn bộ
- `src/routes/index.tsx`: gọi `logVisit` một lần khi trang mount (kèm chống trùng trong sessionStorage để refresh nhiều lần không đếm dồn), phân biệt mobile/desktop qua userAgent
- `src/routes/_authenticated/admin.tsx`: thêm tab "Lượt xem" hiển thị tổng số, lần cuối, danh sách lượt, nút xoá lịch sử
