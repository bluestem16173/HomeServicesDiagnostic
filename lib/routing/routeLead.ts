import { query } from "../db";
import { sendVendorLead } from "../twilio/sendVendorLead";

const BRYAN_VENDOR_ID = "934378ea-7ec5-4928-b01e-2902ab5215a9";

export async function routeLead(lead: any, mode: "manual" | "auto" = "manual") {
  try {
    // Default result
    let result = {
      routed: false,
      vendorId: null as string | null,
      mode,
    };

    // Only route plumbing + electrical to Bryan
    const shouldRouteToBryan =
      (lead.trade === "plumbing" || lead.trade === "electrical") &&
      lead.state === "FL";

    if (shouldRouteToBryan) {
      const { rows } = await query(
        "SELECT * FROM vendors WHERE id = $1 AND active = true",
        [BRYAN_VENDOR_ID]
      );

      const vendor = rows[0];

      if (vendor && vendor.sms_phone) {
        // Send SMS to Bryan
        await sendVendorLead({
          to: vendor.sms_phone,
          lead,
        });

        // Log routing attempt
        await query(
          `
          INSERT INTO lead_routing_attempts (
            lead_id,
            vendor_id,
            attempt_order,
            channel,
            status,
            sent_at
          )
          VALUES ($1, $2, $3, $4, $5, NOW())
          `,
          [lead.id, vendor.id, 1, "sms", "sent"]
        );

        result = {
          routed: true,
          vendorId: vendor.id,
          mode: "bryan_direct" as any,
        };
      }
    }

    return result;
  } catch (err) {
    console.error("Routing error:", err);
    return { routed: false, vendorId: null, mode: mode as any, error: true };
  }
}
