import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type TimelineItem = {
  id: string;
  title: string;
  caption: string;
  quote: string;
  image_path?: string | null;
  image_url?: string | null;
};

export type PhotoRow = {
  id: string;
  url: string; // signed URL
  path: string; // storage path
  caption: string | null;
  frame: string;
  sort_order: number;
};

export type SiteContent = {
  crush_name: string;
  your_name: string;
  messenger_url: string;
  cover_image_url: string | null;
  cover_image_path: string | null;
  welcome_headline: string;
  welcome_subtext: string;
  confession_line1: string;
  confession_line2: string;
  letter_text: string;
  timeline: TimelineItem[];
  photos: PhotoRow[];
  tracks: TrackRow[];
};

export type TrackRow = {
  id: string;
  youtube_url: string;
  youtube_id: string;
  title: string | null;
  sort_order: number;
};

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    const i = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "v");
    if (i >= 0 && parts[i + 1]) return parts[i + 1];
    return null;
  } catch {
    return null;
  }
}

async function signIfNeeded(admin: any, urlOrPath: string | null): Promise<{ url: string | null; path: string | null }> {
  if (!urlOrPath) return { url: null, path: null };
  // If it's already a full URL, return as-is (allows external images too)
  if (urlOrPath.startsWith("http")) return { url: urlOrPath, path: urlOrPath };
  const { data } = await admin.storage.from("photos").createSignedUrl(urlOrPath, 60 * 60 * 24 * 7);
  return { url: data?.signedUrl ?? null, path: urlOrPath };
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: site }, { data: photos }, { data: tracks }] = await Promise.all([
    supabaseAdmin.from("site_content").select("*").eq("id", 1).maybeSingle(),
    supabaseAdmin.from("photos").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabaseAdmin.from("tracks").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
  ]);
  const cover = await signIfNeeded(supabaseAdmin, site?.cover_image_url ?? null);
  const signedPhotos: PhotoRow[] = await Promise.all(
    (photos ?? []).map(async (p: any) => {
      const s = await signIfNeeded(supabaseAdmin, p.url);
      return {
        id: p.id,
        url: s.url ?? "",
        path: p.url,
        caption: p.caption,
        frame: p.frame ?? "polaroid",
        sort_order: p.sort_order ?? 0,
      };
    }),
  );
  const rawTimeline = ((site?.timeline as TimelineItem[]) ?? []);
  const signedTimeline: TimelineItem[] = await Promise.all(
    rawTimeline.map(async (t) => {
      const s = await signIfNeeded(supabaseAdmin, t.image_path ?? null);
      return { ...t, image_path: t.image_path ?? null, image_url: s.url };
    }),
  );
  return {
    crush_name: site?.crush_name ?? "Tiên",
    your_name: site?.your_name ?? "Anh",
    messenger_url: site?.messenger_url ?? "https://m.me/",
    cover_image_url: cover.url,
    cover_image_path: site?.cover_image_url ?? null,
    welcome_headline: site?.welcome_headline ?? "Gửi Tiên,",
    welcome_subtext: site?.welcome_subtext ?? "",
    confession_line1: site?.confession_line1 ?? "Anh thích em.",
    confession_line2: site?.confession_line2 ?? "Em có đồng ý làm người yêu anh không?",
    letter_text: site?.letter_text ?? "",
    timeline: signedTimeline,
    photos: signedPhotos,
    tracks: (tracks ?? []).map((t: any) => ({
      id: t.id,
      youtube_url: t.youtube_url,
      youtube_id: t.youtube_id,
      title: t.title,
      sort_order: t.sort_order ?? 0,
    })),
  };
});

const siteUpdateSchema = z.object({
  crush_name: z.string().min(1).max(60),
  your_name: z.string().min(1).max(60),
  messenger_url: z.string().url().max(300),
  cover_image_url: z.string().max(500).nullable(),
  welcome_headline: z.string().min(1).max(200),
  welcome_subtext: z.string().max(1000),
  confession_line1: z.string().min(1).max(200),
  confession_line2: z.string().min(1).max(200),
  letter_text: z.string().max(5000),
  timeline: z.array(z.object({
    id: z.string().min(1).max(60),
    title: z.string().min(1).max(120),
    caption: z.string().max(600),
    quote: z.string().max(600),
    image_path: z.string().max(500).nullable().optional(),
  })).max(20),
});

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden");
}

export const updateSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => siteUpdateSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const addTrackSchema = z.object({
  youtube_url: z.string().url().max(500),
  title: z.string().max(200).nullable().optional(),
});

export const addTrack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => addTrackSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const id = extractYouTubeId(data.youtube_url);
    if (!id) throw new Error("Link YouTube không hợp lệ");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tracks").insert({
      youtube_url: data.youtube_url,
      youtube_id: id,
      title: data.title ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTrack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("tracks").delete().eq("id", data.id);
    return { ok: true };
  });

const addPhotoSchema = z.object({
  path: z.string().min(1).max(300),
  caption: z.string().max(200).nullable(),
  frame: z.enum(["polaroid", "glass", "modern", "heart"]).default("polaroid"),
});

export const addPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => addPhotoSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("photos").insert({
      url: data.path,
      caption: data.caption,
      frame: data.frame,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), path: z.string().max(500) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("photos").delete().eq("id", data.id);
    if (data.path && !data.path.startsWith("http")) {
      await supabaseAdmin.storage.from("photos").remove([data.path]);
    }
    return { ok: true };
  });

const submissionSchema = z.object({
  decision: z.enum(["yes", "later"]).default("yes"),
  date: z.string().max(30).optional().default(""),
  time: z.string().max(30).optional().default(""),
  location: z.string().max(200).optional().default(""),
  food: z.string().max(200).optional().default(""),
  drink: z.string().max(200).optional().default(""),
  note: z.string().max(1000).optional().default(""),
});

export const createSubmission = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submissionSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("submissions").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("submissions").delete().eq("id", data.id);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: Boolean(data) };
  });