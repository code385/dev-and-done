// Email template builders for EmailJS

export function buildContactEmailTemplate(data) {
  return {
    email_type: 'contact',
    to_name: 'DevAndDone Team',
    from_name: data.name,
    from_email: data.email,
    company: data.company || 'Not provided',
    message: data.message,
    reply_to: data.email,
  };
}

export function buildConfirmationEmailTemplate(data) {
  return {
    email_type: 'confirmation',
    to_name: data.name,
    to_email: data.email,
    from_name: 'DevAndDone',
    message: `Thank you for contacting DevAndDone! We've received your message and will get back to you within 24 hours.

Your message:
${data.message}

Best regards,
The DevAndDone Team`,
  };
}

export function buildEstimateEmailTemplate(data) {
  return {
    email_type: 'estimate',
    to_name: 'DevAndDone Team',
    from_name: data.name || 'Potential Client',
    from_email: data.email,
    project_type: data.projectType || 'Not specified',
    budget_range: data.budgetRange || 'Not specified',
    timeline: data.timeline || 'Not specified',
    message: data.message || 'No additional message',
    reply_to: data.email,
  };
}

export function buildNewsletterConfirmationTemplate(data) {
  return {
    email_type: 'newsletter',
    to_name: data.name || 'Subscriber',
    to_email: data.email,
    from_name: 'DevAndDone',
    message: 'Thank you for subscribing to DevAndDone newsletter! You\'ll receive updates about our latest projects, tech insights, and company news.',
  };
}

