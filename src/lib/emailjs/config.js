// EmailJS configuration
export const emailjsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
};

export function isEmailJSConfigured() {
  return !!(
    emailjsConfig.serviceId &&
    emailjsConfig.publicKey &&
    emailjsConfig.templateId
  );
}

