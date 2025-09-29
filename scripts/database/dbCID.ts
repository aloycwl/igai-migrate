import { createClient as cc } from "@supabase/supabase-js";

// Validate environment variable
if (!process.env.SB) {
  throw new Error("Missing required environment variable: SB (Supabase API key). Please configure it in Replit Secrets.");
}

const s = cc("https://uxxfyiukhlsahcyszutt.supabase.co", process.env.SB);

export async function dbCID() {
  try {
    // Select query with error checking
    const selectResult = await s
      .from("igai")
      .select("cid")
      .or("m.is.null,m.neq.true")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (selectResult.error) {
      throw new Error(`Database select error: ${selectResult.error.message}`);
    }

    const cid = selectResult.data?.cid;
    
    if (!cid) {
      return { success: false, error: "No CID found", type: "NO_RECORDS" };
    }

    // Update query with error checking
    const updateResult = await s
      .from("igai")
      .update({ m: true })
      .eq("cid", cid);

    if (updateResult.error) {
      throw new Error(`Database update error: ${updateResult.error.message}`);
    }
    
    return { success: true, cid };
  } catch (e) {
    return { 
      success: false, 
      error: e instanceof Error ? e.message : String(e), 
      type: "OPERATION_ERROR" 
    };
  }
}