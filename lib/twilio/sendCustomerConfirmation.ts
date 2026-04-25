import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function sendCustomerConfirmation(
  phone: string
) {

  try {
    const message = await client.messages.create({
      body: 'We received your request. A local technician may contact you shortly. Reply STOP to opt out.',
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Failed to send customer confirmation SMS:', error);
    return { success: false, error };
  }
}
