// Environment variable validation

const requiredEnvVars = {
  development: [
    'MONGODB_URI',
  ],
  production: [
    'MONGODB_URI',
    'NEXT_PUBLIC_SITE_URL',
  ],
};

const optionalEnvVars = [
  'GOOGLE_AI_API_KEY',
  'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
  'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
  'CONTACT_EMAIL',
  'ADMIN_EMAIL',
];

export function validateEnv() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  const missing = [];

  required.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
    if (env === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  // Check optional but recommended vars
  const missingOptional = [];
  optionalEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingOptional.push(varName);
    }
  });

  if (missingOptional.length > 0) {
    console.info(`Optional environment variables not set: ${missingOptional.join(', ')}`);
  }

  return {
    valid: missing.length === 0,
    missing,
    missingOptional,
  };
}

