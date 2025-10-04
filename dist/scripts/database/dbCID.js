"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbCID = dbCID;
const supabase_js_1 = require("@supabase/supabase-js");
// Validate environment variable
if (!process.env.SUPABASE) {
    throw new Error("Missing required environment variable: SUPABASE (Supabase API key). Please configure it in Replit Secrets.");
}
const s = (0, supabase_js_1.createClient)("https://uxxfyiukhlsahcyszutt.supabase.co", process.env.SUPABASE);
async function dbCID() {
    try {
        // Select query with error checking
        const selectResult = await s
            .from("igai")
            .select("cid, id, created_at")
            .or("m.is.null,m.neq.true")
            .order("id", { ascending: true })
            .limit(1)
            .maybeSingle();
        if (selectResult.error) {
            throw new Error(`Database select error: ${selectResult.error.message}`);
        }
        const data = selectResult.data;
        if (!data?.cid) {
            return { success: false, error: "No CID found", type: "NO_RECORDS" };
        }
        const { cid, id, created_at } = data;
        // Update query with error checking
        const updateResult = await s
            .from("igai")
            .update({ m: true })
            .eq("cid", cid);
        if (updateResult.error) {
            throw new Error(`Database update error: ${updateResult.error.message}`);
        }
        // Convert datetime to unix timestamp
        const unixTimestamp = Math.floor(new Date(created_at).getTime() / 1000).toString();
        return {
            success: true,
            cid,
            id,
            created_at,
            unixTimestamp
        };
    }
    catch (e) {
        return {
            success: false,
            error: e instanceof Error ? e.message : String(e),
            type: "OPERATION_ERROR"
        };
    }
}
