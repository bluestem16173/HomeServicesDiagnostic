// app/api/db-proof/route.ts

import { query } from "@/lib/db";

export async function GET() {
    try {
        const count = await query("SELECT COUNT(*)::int AS count FROM pages");

        const sample = await query(`
      SELECT slug 
      FROM pages 
      WHERE status = 'published' 
      ORDER BY updated_at DESC 
      LIMIT 5
    `);

        return Response.json({
            ok: true,
            count: count.rows[0].count,
            sample: sample.rows,
            db_hint: process.env.DATABASE_URL?.slice(0, 40) + "..."
        });
    } catch (e: any) {
        return new Response(
            JSON.stringify({ ok: false, error: e.message }),
            { status: 500 }
        );
    }
}