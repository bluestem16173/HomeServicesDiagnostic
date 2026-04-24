import { query } from "@/lib/db";

export async function GET() {
    try {
        const count = await query("SELECT COUNT(*)::int AS count FROM pages");
        const sample = await query(
            "SELECT slug FROM pages WHERE status = 'published' ORDER BY updated_at DESC LIMIT 3"
        );

        return Response.json({
            ok: true,
            db: process.env.DATABASE_URL?.slice(0, 30) + "...",
            count: count.rows[0].count,
            sample: sample.rows,
        });
    } catch (e: any) {
        return new Response(
            JSON.stringify({ ok: false, error: e.message }),
            { status: 500 }
        );
    }
}