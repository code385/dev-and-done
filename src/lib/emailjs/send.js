'use client';

import emailjs from '@emailjs/browser';
import { emailjsConfig, isEmailJSConfigured } from './config';
import {
  buildContactEmailTemplate,
  buildConfirmationEmailTemplate,
  buildEstimateEmailTemplate,
  buildNewsletterConfirmationTemplate,
} from './templates';

// Initialize EmailJS
if (typeof window !== 'undefined') {
  if (emailjsConfig.publicKey) {
    try {
      emailjs.init(emailjsConfig.publicKey);
    } catch (initError) {
      console.error('Failed to initialize EmailJS:', initError);
    }
  } else {
    console.warn('EmailJS public key not configured. Email functionality will be disabled.');
  }
}

export async function sendContactEmail(data) {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured. Skipping email send.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const templateParams = buildContactEmailTemplate(data);
    
    // Validate configuration before sending
    if (!emailjsConfig.serviceId || !emailjsConfig.templateId) {
      const errorMsg = 'EmailJS service ID or template ID is missing';
      console.error('EmailJS configuration error:', errorMsg);
      return { success: false, error: errorMsg };
    }
    
    const result = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams
    );

    return { success: true, messageId: result.text };
  } catch (error) {
    // Enhanced error logging
    const errorMessage = error?.message || error?.text || String(error) || JSON.stringify(error) || 'Unknown error';
    const errorDetails = {
      message: errorMessage,
      status: error?.status,
      text: error?.text,
      fullError: error,
      errorType: typeof error,
      errorKeys: Object.keys(error || {}),
    };
    console.error('Error sending contact email:', errorDetails);
    return { success: false, error: errorMessage };
  }
}

export async function sendConfirmationEmail(data) {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured. Skipping confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const templateParams = buildConfirmationEmailTemplate(data);
    
    // Validate configuration before sending
    if (!emailjsConfig.serviceId || !emailjsConfig.templateId) {
      const errorMsg = 'EmailJS service ID or template ID is missing';
      console.error('EmailJS configuration error:', errorMsg);
      return { success: false, error: errorMsg };
    }
    
    const result = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams
    );

    return { success: true, messageId: result.text };
  } catch (error) {
    // Enhanced error logging
    const errorMessage = error?.message || error?.text || String(error) || JSON.stringify(error) || 'Unknown error';
    const errorDetails = {
      message: errorMessage,
      status: error?.status,
      text: error?.text,
      fullError: error,
      errorType: typeof error,
      errorKeys: Object.keys(error || {}),
    };
    console.error('Error sending confirmation email:', errorDetails);
    return { success: false, error: errorMessage };
  }
}

export async function sendEstimateEmail(data) {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured. Skipping estimate email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const templateParams = buildEstimateEmailTemplate(data);
    
    // Validate configuration before sending
    if (!emailjsConfig.serviceId || !emailjsConfig.templateId) {
      const errorMsg = 'EmailJS service ID or template ID is missing';
      console.error('EmailJS configuration error:', errorMsg);
      return { success: false, error: errorMsg };
    }
    
    const result = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams
    );

    return { success: true, messageId: result.text };
  } catch (error) {
    const errorMessage = error?.message || error?.text || String(error) || JSON.stringify(error) || 'Unknown error';
    console.error('Error sending estimate email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function sendNewsletterConfirmation(data) {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured. Skipping newsletter confirmation.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const templateParams = buildNewsletterConfirmationTemplate(data);
    
    // Validate configuration before sending
    if (!emailjsConfig.serviceId || !emailjsConfig.templateId) {
      const errorMsg = 'EmailJS service ID or template ID is missing';
      console.error('EmailJS configuration error:', errorMsg);
      return { success: false, error: errorMsg };
    }
    
    const result = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams
    );

    return { success: true, messageId: result.text };
  } catch (error) {
    const errorMessage = error?.message || error?.text || String(error) || JSON.stringify(error) || 'Unknown error';
    console.error('Error sending newsletter confirmation:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

