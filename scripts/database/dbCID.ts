import { createClient as cc } from "@supabase/supabase-js";

const s = cc("https://uxxfyiukhlsahcyszutt.supabase.co", process.env.SB);

export async function dbCID() {
  try {
    const cid = (
      await s
        .from("igai")
        .select("cid")
        .or("m.is.null,m.neq.true")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle()
    ).data.cid;

    await s.from("igai").update({ m: true }).eq("cid", cid);
    
    return cid;
  } catch (e) {
    return e;
  }
}