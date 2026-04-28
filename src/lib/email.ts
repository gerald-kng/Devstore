export type PurchaseEmailPayload = {
  to: string;
  orderId: string;
  productName: string;
  accessPortalUrl: string;
};

/**
 * Placeholder for Resend / SendGrid. Wire your provider here and set API keys in env.
 */
export async function sendPurchaseEmail(
  payload: PurchaseEmailPayload,
): Promise<void> {
  const {
    to,
    orderId,
    productName,
    accessPortalUrl,
  } = payload;

  // Example Resend integration (uncomment when ready):
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: '...', to, subject: '...', html: '...' });

  console.info("[email:placeholder] purchase delivery", {
    to,
    orderId,
    productName,
    accessPortalUrl,
  });
}

export async function sendAccessLinkEmail(payload: PurchaseEmailPayload): Promise<void> {
  await sendPurchaseEmail(payload);
}
