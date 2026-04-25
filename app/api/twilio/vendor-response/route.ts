import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import twilio from 'twilio';

// Twilio uses application/x-www-form-urlencoded
export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    
    const fromPhone = params.get('From');
    const bodyText = params.get('Body')?.trim().toUpperCase() || '';
    
    if (!fromPhone) {
      return NextResponse.json({ error: 'Missing From phone number' }, { status: 400 });
    }

    // Find the vendor by phone number
    const { rows: vendors } = await query(`SELECT id FROM vendors WHERE sms_phone = $1`, [fromPhone]);
    
    if (vendors.length === 0) {
      // Not a known vendor
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message("Error: Phone number not recognized in vendor system.");
      return new NextResponse(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' }
      });
    }
    
    const vendorId = vendors[0].id;

    // Find the most recent pending lead routed to this vendor
    const { rows: attempts } = await query(`
      SELECT lead_id, status 
      FROM lead_routing_attempts 
      WHERE vendor_id = $1 AND status = 'sent'
      ORDER BY sent_at DESC 
      LIMIT 1
    `, [vendorId]);

    const twiml = new twilio.twiml.MessagingResponse();

    if (attempts.length === 0) {
      twiml.message("No pending leads found for you at this time.");
      return new NextResponse(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    const leadId = attempts[0].lead_id;

    if (bodyText === 'ACCEPT') {
      // Assign lead to vendor
      // 1. Update attempt status
      await query(`
        UPDATE lead_routing_attempts 
        SET status = 'accepted', responded_at = NOW() 
        WHERE lead_id = $1 AND vendor_id = $2
      `, [leadId, vendorId]);

      // 2. Update lead
      await query(`
        UPDATE leads 
        SET assigned_vendor_id = $1, status = 'assigned' 
        WHERE id = $2
      `, [vendorId, leadId]);

      twiml.message("Lead accepted! Please contact the customer.");

    } else if (bodyText === 'PASS') {
      // Mark as rejected
      await query(`
        UPDATE lead_routing_attempts 
        SET status = 'rejected', responded_at = NOW() 
        WHERE lead_id = $1 AND vendor_id = $2
      `, [leadId, vendorId]);
      
      twiml.message("Lead passed. We will route it to the next available vendor.");

      // Here you could trigger a background job to route to the next vendor 
      // if using 'sequential' routing mode.
      
    } else {
      twiml.message("Please reply with ACCEPT or PASS.");
    }

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Error handling vendor response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
