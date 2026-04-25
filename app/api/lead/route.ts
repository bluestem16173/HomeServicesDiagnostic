import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { name, phone, zip, description, serviceCategory, cityContext } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    const destinationNumber = process.env.LEAD_NOTIFY_PHONE || process.env.YOUR_PHONE; // Your phone number

    if (!accountSid || !authToken || !twilioNumber || !destinationNumber) {
      console.warn("Twilio credentials not configured. Lead data:", { name, phone, zip, description });
      return NextResponse.json({ success: true, warning: "Twilio not configured" });
    }

    const client = twilio(accountSid, authToken);

    const cityStr = cityContext ? cityContext.replace(/, FL/i, '') : zip;
    const issueStr = description || serviceCategory || 'Home Service';
    const messageBody = `New lead: ${issueStr} - ${cityStr} - ${phone}`;

    await client.messages.create({
      body: messageBody,
      from: twilioNumber,
      to: destinationNumber,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ success: false, error: "Failed to process lead" }, { status: 500 });
  }
}
