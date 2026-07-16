
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS reply_letter text NOT NULL DEFAULT '';
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS planner_title text NOT NULL DEFAULT 'Buổi hẹn đầu tiên';
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS planner_subtitle text NOT NULL DEFAULT 'Em chọn — anh lo phần còn lại.';
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS planner_eyebrow text NOT NULL DEFAULT 'Chương V';
