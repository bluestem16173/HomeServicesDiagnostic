import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER;

export async function sendAdminNotification(messageBody: string) {
  if (!ADMIN_PHONE_NUMBER) {
    console.error('ADMIN_PHONE_NUMBER is not set, skipping admin notification.');
    return { success: false, reason: 'missing_admin_phone' };
  }

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: TWILIO_PHONE_NUMBER,
      to: ADMIN_PHONE_NUMBER,
    });

    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Failed to send admin notification SMS:', error);
    return { success: false, error };
  }
}
