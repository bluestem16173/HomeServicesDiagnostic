import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendVendorLead({ to, lead }: any) {
  const message = `
New ${lead.trade} lead: ${lead.symptom_slug.replaceAll("-", " ")}

City: ${lead.city_slug.replaceAll("-", " ")}
Customer: ${lead.name}
Phone: ${lead.phone}

Reply ACCEPT or PASS
`;

  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  });
}
