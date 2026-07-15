import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  getSiteContent,
  updateSiteContent,
  addPhoto,
  deletePhoto,
  listSubmissions,
  deleteSubmission,
  checkIsAdmin,
  addTrack,
  deleteTrack,
  type SiteContent,
  type TimelineItem,
} from "@/lib/content.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Sub = {
  id: string;
  decision: string;
  date: string | null;
  time: string | null;
  location: string | null;
  food: string | null;
  drink: string | null;
  note: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const fetchContent = useServerFn(getSiteContent);
  const fetchAdmin = useServerFn(checkIsAdmin);
  const saveContent = useServerFn(updateSiteContent);
  const insertPhoto = useServerFn(addPhoto);
  const removePhoto = useServerFn(deletePhoto);
  const fetchSubs = useServerFn(listSubmissions);
  const removeSub = useServerFn(deleteSubmission);
  const insertTrack = useServerFn(addTrack);
  const removeTrack = useServerFn(deleteTrack);

  const [tab, setTab] = useState<"content" | "photos" | "cover" | "music" | "subs">("content");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [newTrackUrl, setNewTrackUrl] = useState("");
  const [newTrackTitle, setNewTrackTitle] = useState("");

  const load = async () => {
    const c = await fetchContent();
    setContent(c);
    const s = await fetchSubs();
    setSubs(s as Sub[]);
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await fetchAdmin();
        setAllowed(r.isAdmin);
        if (r.isAdmin) await load();
      } catch {
        setAllowed(false);
      }
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (allowed === null) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Đang tải...</div>;
  if (allowed === false) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center p-6">
      <p className="text-lg">Tài khoản này không có quyền admin.</p>
      <p className="text-xs text-muted-foreground">Chỉ email <code>hoangquockhanh204@gmail.com</code> mới được cấp quyền.</p>
      <button onClick={signOut} className="mt-2 rounded-full bg-gradient-to-r from-pink to-secondary px-6 py-2 text-sm text-primary-foreground">Đăng xuất</button>
    </div>
  );
  if (!content) return null;

  const save = async (patch: Partial<SiteContent>) => {
    setSaving(true);
    setMsg(null);
    try {
      const next = { ...content, ...patch };
      await saveContent({
        data: {
          crush_name: next.crush_name,
          your_name: next.your_name,
          messenger_url: next.messenger_url,
          cover_image_url: next.cover_image_path,
          welcome_headline: next.welcome_headline,
          welcome_subtext: next.welcome_subtext,
          confession_line1: next.confession_line1,
          confession_line2: next.confession_line2,
          letter_text: next.letter_text,
          timeline: next.timeline,
        },
      });
      setMsg("Đã lưu ✓");
      await load();
    } catch (e: any) {
      setMsg("Lỗi: " + (e.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file);
    if (error) throw error;
    return path;
  };

  const cls = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white";
  const label = "block text-xs uppercase tracking-widest text-lavender mb-1";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-light text-gradient">Admin — {content.crush_name}</h1>
          <p className="text-xs text-muted-foreground">Sửa gì thì lưu nấy, Tiên không thấy trang này.</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="rounded-full border border-white/20 px-4 py-2 text-xs">Xem site ↗</a>
          <button onClick={signOut} className="rounded-full bg-white/10 px-4 py-2 text-xs">Đăng xuất</button>
        </div>
      </header>

      <nav className="flex gap-2 border-b border-white/10 px-6 py-3 overflow-x-auto">
        {[
          ["content", "Nội dung"],
          ["cover", "Ảnh bìa"],
          ["photos", `Gallery (${content.photos.length})`],
          ["subs", `Form của Tiên (${subs.length})`],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`rounded-full px-4 py-2 text-xs ${tab === k ? "bg-gradient-to-r from-pink to-secondary text-primary-foreground" : "bg-white/5 text-muted-foreground"}`}>
            {l}
          </button>
        ))}
      </nav>

      {msg && <div className="px-6 py-2 text-xs text-soft-pink">{msg}</div>}

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {tab === "content" && (
          <div className="space-y-6">
            <section className="glass rounded-2xl p-6 grid gap-4 md:grid-cols-2">
              <div><label className={label}>Tên crush</label><input className={cls} value={content.crush_name} onChange={(e) => setContent({ ...content, crush_name: e.target.value })} /></div>
              <div><label className={label}>Tên bạn</label><input className={cls} value={content.your_name} onChange={(e) => setContent({ ...content, your_name: e.target.value })} /></div>
              <div className="md:col-span-2"><label className={label}>Link Messenger</label><input className={cls} value={content.messenger_url} onChange={(e) => setContent({ ...content, messenger_url: e.target.value })} /></div>
            </section>

            <section className="glass rounded-2xl p-6 space-y-3">
              <h2 className="text-lg text-gradient">Trang chào & lời tỏ tình</h2>
              <div><label className={label}>Tiêu đề welcome</label><input className={cls} value={content.welcome_headline} onChange={(e) => setContent({ ...content, welcome_headline: e.target.value })} /></div>
              <div><label className={label}>Đoạn intro</label><textarea rows={3} className={cls} value={content.welcome_subtext} onChange={(e) => setContent({ ...content, welcome_subtext: e.target.value })} /></div>
              <div><label className={label}>Câu tỏ tình (dòng 1)</label><input className={cls} value={content.confession_line1} onChange={(e) => setContent({ ...content, confession_line1: e.target.value })} /></div>
              <div><label className={label}>Câu hỏi (dòng 2)</label><input className={cls} value={content.confession_line2} onChange={(e) => setContent({ ...content, confession_line2: e.target.value })} /></div>
            </section>

            <section className="glass rounded-2xl p-6 space-y-3">
              <h2 className="text-lg text-gradient">Lá thư</h2>
              <textarea rows={10} className={cls + " font-serif"} value={content.letter_text} onChange={(e) => setContent({ ...content, letter_text: e.target.value })} />
              <p className="text-xs text-muted-foreground">Xuống dòng bằng Enter. Sẽ hiện dạng thư viết tay.</p>
            </section>

            <section className="glass rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-gradient">Timeline câu chuyện</h2>
                <button onClick={() => setContent({ ...content, timeline: [...content.timeline, { id: crypto.randomUUID(), title: "", caption: "", quote: "" }] })}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs">+ Thêm mốc</button>
              </div>
              {content.timeline.map((t, i) => (
                <div key={t.id} className="rounded-xl border border-white/10 p-3 space-y-2">
                  <div className="flex justify-between text-xs text-lavender">Mốc #{i + 1}
                    <button onClick={() => setContent({ ...content, timeline: content.timeline.filter((_, j) => j !== i) })} className="text-pink">Xoá</button>
                  </div>
                  <input className={cls} placeholder="Tiêu đề" value={t.title} onChange={(e) => update(i, { title: e.target.value })} />
                  <textarea rows={2} className={cls} placeholder="Mô tả" value={t.caption} onChange={(e) => update(i, { caption: e.target.value })} />
                  <input className={cls} placeholder="Câu quote" value={t.quote} onChange={(e) => update(i, { quote: e.target.value })} />
                </div>
              ))}
            </section>

            <button disabled={saving} onClick={() => save({})} className="glow-pink w-full rounded-full bg-gradient-to-r from-pink to-secondary py-3 text-sm text-primary-foreground disabled:opacity-60">
              {saving ? "Đang lưu..." : "Lưu tất cả"}
            </button>
          </div>
        )}

        {tab === "cover" && (
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-lg text-gradient">Ảnh bìa (nền welcome)</h2>
            {content.cover_image_url && <img src={content.cover_image_url} alt="cover" className="w-full max-h-80 object-cover rounded-xl" />}
            <input type="file" accept="image/*" onChange={async (e) => {
              const f = e.target.files?.[0]; if (!f) return;
              setSaving(true); setMsg("Đang upload...");
              try {
                const path = await uploadImage(f);
                await save({ cover_image_path: path });
              } catch (err: any) { setMsg("Lỗi: " + err.message); }
              finally { setSaving(false); }
            }} />
            {content.cover_image_path && (
              <button onClick={() => save({ cover_image_path: null })} className="text-xs text-pink underline">Xoá ảnh bìa</button>
            )}
          </section>
        )}

        {tab === "photos" && (
          <section className="space-y-4">
            <div className="glass rounded-2xl p-6 space-y-3">
              <h2 className="text-lg text-gradient">Thêm ảnh vào gallery</h2>
              <input type="file" accept="image/*" multiple onChange={async (e) => {
                const files = Array.from(e.target.files ?? []); if (!files.length) return;
                setSaving(true); setMsg("Đang upload " + files.length + " ảnh...");
                try {
                  for (const f of files) {
                    const path = await uploadImage(f);
                    await insertPhoto({ data: { path, caption: null, frame: "polaroid" } });
                  }
                  await load(); setMsg("Xong ✓");
                } catch (err: any) { setMsg("Lỗi: " + err.message); }
                finally { setSaving(false); }
              }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {content.photos.map((p) => (
                <div key={p.id} className="glass rounded-xl overflow-hidden">
                  <img src={p.url} alt="" className="aspect-square w-full object-cover" />
                  <div className="p-2 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{p.frame}</span>
                    <button onClick={async () => { await removePhoto({ data: { id: p.id, path: p.path } }); await load(); }} className="text-pink">Xoá</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "subs" && (
          <section className="space-y-3">
            {subs.length === 0 && <p className="text-muted-foreground text-center py-8">Chưa có form nào cả. 💤</p>}
            {subs.map((s) => (
              <div key={s.id} className="glass rounded-xl p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`text-lg ${s.decision === "yes" ? "text-gradient" : "text-muted-foreground"}`}>
                      {s.decision === "yes" ? "❤️ Đồng ý" : "Từ chối / để sau"}
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("vi-VN")}</div>
                  </div>
                  <button onClick={async () => { await removeSub({ data: { id: s.id } }); await load(); }} className="text-xs text-pink">Xoá</button>
                </div>
                {(s.date || s.time) && <div className="text-sm"><span className="text-lavender">Ngày giờ:</span> {s.date} {s.time}</div>}
                {s.location && <div className="text-sm"><span className="text-lavender">Nơi:</span> {s.location}</div>}
                {s.food && <div className="text-sm"><span className="text-lavender">Món:</span> {s.food}</div>}
                {s.drink && <div className="text-sm"><span className="text-lavender">Uống:</span> {s.drink}</div>}
                {s.note && <div className="text-sm border-l-2 border-pink/60 pl-3 mt-2 italic">{s.note}</div>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );

  function update(i: number, patch: Partial<TimelineItem>) {
    if (!content) return;
    const timeline = content.timeline.map((t, j) => j === i ? { ...t, ...patch } : t);
    setContent({ ...content, timeline });
  }
}