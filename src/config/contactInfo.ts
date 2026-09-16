/**
 * Update these values here to change contact details site-wide — no other files need to be touched.
 */
export const CONTACT_INFO = {
  formspreeEndpoint: "https://formspree.io/f/mvkojeyd",
  whatsappNumber: "918248212154",
  callMeBotApiKey: "YOUR_CALLMEBOT_API_KEY", // replace once obtained
  phone: "+91 63791 49283 / +91 98437 62668",        // business phone numbers
  phoneSupport: "+91 63791 49283",
  phoneSales: "+91 98437 62668",
  email: "contact@chemtechpolymers.com / sales@chemtechpolymers.com", // business email
  emailPrimary: "contact@chemtechpolymers.com",
  emailSales: "sales@chemtechpolymers.com",
  address: "Chemtech Polymers Manufacturing Plant & QC Labs, Industrial Area, India", // business address
  mapEmbedUrl: "",  // add Google Maps embed URL if available
  hours: "Monday – Saturday: 9:00 AM – 6:30 PM IST",
};

export interface ContactNotificationPayload {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  product_interest?: string;
  product_requested?: string;
  request_type?: string;
  message?: string;
}

/**
 * Background WhatsApp notification via CallMeBot.
 * Completely fire-and-forget — does not block or delay UI confirmation.
 */
export async function sendWhatsAppNotification(formData: ContactNotificationPayload): Promise<void> {
  const message = encodeURIComponent(
    `New Chemtech Inquiry\nName: ${formData.name}\nCompany: ${formData.company || "-"}\nPhone: ${formData.phone || "-"}\nProduct: ${formData.product_interest || formData.product_requested || "-"}\nType: ${formData.request_type || "-"}\nMessage: ${formData.message || "-"}`
  );

  try {
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${CONTACT_INFO.whatsappNumber}&text=${message}&apikey=${CONTACT_INFO.callMeBotApiKey}`
    );
  } catch (error) {
    console.error("WhatsApp notification failed (non-blocking):", error);
  }
}
