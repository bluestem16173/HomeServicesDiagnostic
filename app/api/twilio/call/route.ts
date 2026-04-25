import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  // Forward directly to vendor (Bryan)
  const forwardingNumber = process.env.BRYAN_PHONE;

  if (!forwardingNumber) {
    twiml.say("We're sorry, but our offices are currently unavailable. Please try again later.");
  } else {
    // Forward the call directly to the forwarding number
    twiml.dial(forwardingNumber);
  }

  return new NextResponse(twiml.toString(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
