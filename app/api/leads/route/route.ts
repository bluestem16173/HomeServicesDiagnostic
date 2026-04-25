import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '../../../../lib/db';
import { routeLead } from '../../../../lib/routing/routeLead';
import { sendCustomerConfirmation } from '../../../../lib/twilio/sendCustomerConfirmation';
import { sendAdminNotification } from '../../../../lib/twilio/sendAdminNotification';

const LeadSchema = z.object({
  trade: z.enum(['hvac', 'plumbing', 'electrical', 'rv']),
  symptom_slug: z.string().min(1),
  city_slug: z.string().min(1),
  state: z.string().length(2),
  name: z.string().min(2),
  phone: z.string().min(10).transform((val) => {
    const digits = val.replace(/\D/g, '');
    return `+1${digits}`;
  }),
  email: z.string().email().optional(),
  consent_sms: z.boolean(),
  consent_text_version: z.string().min(1),
  source_url: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate using Zod
    const validatedData = LeadSchema.parse(body);

    // 2. Store lead in database
    const insertQuery = `
      INSERT INTO leads (
        trade, symptom_slug, city_slug, state, name, phone, email, 
        consent_sms, consent_timestamp, consent_text_version, source_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const { rows } = await query(insertQuery, [
      validatedData.trade,
      validatedData.symptom_slug,
      validatedData.city_slug,
      validatedData.state,
      validatedData.name,
      validatedData.phone,
      validatedData.email || null,
      validatedData.consent_sms,
      validatedData.consent_sms ? new Date().toISOString() : null, // Record consent timestamp
      validatedData.consent_text_version,
      validatedData.source_url
    ]);

    const lead = rows[0];

    // 3. Call routing engine (defaulting to manual for initial setup as requested)
    // You can change 'manual' to 'exclusive' or 'sequential' in production
    const routingResult = await routeLead(lead, 'manual');

    await sendAdminNotification(`
New ${lead.trade} lead:
${lead.symptom_slug.replaceAll('-', ' ')}

City: ${lead.city_slug}
Phone: ${lead.phone}
`);

    // 4. Optionally send customer SMS (ONLY if consent_sms = true)
    if (lead.consent_sms && lead.phone){
      await sendCustomerConfirmation(lead.phone);
    }

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      routing: routingResult
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    
    console.error('Error processing lead:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
