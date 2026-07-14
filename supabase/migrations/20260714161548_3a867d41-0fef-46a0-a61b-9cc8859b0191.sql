
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Auto-grant admin to specific email on signup (only when email is confirmed)
CREATE OR REPLACE FUNCTION public.grant_admin_for_owner()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'hoangquockhanh204@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_owner();

CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_owner();

-- Site content (single row, id=1)
CREATE TABLE public.site_content (
  id INT PRIMARY KEY DEFAULT 1,
  crush_name TEXT NOT NULL DEFAULT 'Tiên',
  your_name TEXT NOT NULL DEFAULT 'Anh',
  messenger_url TEXT NOT NULL DEFAULT 'https://m.me/',
  cover_image_url TEXT,
  welcome_headline TEXT NOT NULL DEFAULT 'Gửi Tiên,',
  welcome_subtext TEXT NOT NULL DEFAULT 'Có một điều anh muốn nói với em từ lâu. Anh không giỏi diễn đạt bằng lời, nên anh làm cả một website nhỏ — để em cảm nhận, chậm rãi, từng khoảnh khắc.',
  confession_line1 TEXT NOT NULL DEFAULT 'Anh thích em, Tiên.',
  confession_line2 TEXT NOT NULL DEFAULT 'Em có đồng ý làm người yêu anh không?',
  letter_text TEXT NOT NULL DEFAULT 'Tiên thân yêu,\n\nAnh không biết bắt đầu từ đâu. Có lẽ là từ ngày anh nhận ra — một ngày không có tin nhắn của em, anh thấy thiếu một điều gì rất khó gọi tên.\n\nEm không cần trả lời ngay. Chỉ cần đọc hết những gì anh chuẩn bị cho em ở đây, và biết rằng — em quan trọng với anh nhiều lắm.\n\n— Anh',
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (id = 1)
);
INSERT INTO public.site_content (id, timeline) VALUES (1, '[
  {"id":"first-meet","title":"Lần đầu gặp","caption":"Có những khoảnh khắc mà anh biết — nó sẽ ở lại rất lâu.","quote":"Trong hàng nghìn khuôn mặt, ánh mắt anh chỉ dừng ở em."},
  {"id":"first-chat","title":"Tin nhắn đầu tiên","caption":"Anh gõ rồi xoá, xoá rồi gõ, chỉ để một câu chào trông thật tự nhiên.","quote":"Và em đã trả lời — thế là bắt đầu một chương mới."},
  {"id":"first-coffee","title":"Ly cafe đầu tiên","caption":"Anh không nhớ mình uống gì, chỉ nhớ em cười.","quote":"Cái cách em khuấy ly nước cũng đủ khiến anh mất tập trung."},
  {"id":"today","title":"Và hôm nay","caption":"Anh làm cả một website chỉ để nói với em một điều.","quote":"Chờ em đọc tới cuối nhé."}
]'::jsonb);

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can update site content" ON public.site_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Photos
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT,
  frame TEXT NOT NULL DEFAULT 'polaroid',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.photos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photos TO authenticated;
GRANT ALL ON public.photos TO service_role;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view photos" ON public.photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can insert photos" ON public.photos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin can update photos" ON public.photos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin can delete photos" ON public.photos FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Submissions (form đáp lại của Tiên)
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision TEXT NOT NULL DEFAULT 'yes',
  date TEXT,
  time TEXT,
  location TEXT,
  food TEXT,
  drink TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.submissions TO anon, authenticated;
GRANT SELECT, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin can read submissions" ON public.submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin can delete submissions" ON public.submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
