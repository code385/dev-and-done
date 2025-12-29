import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function verifyToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const payload = await verifyToken();

  if (!payload) {
    throw new Error('Unauthorized');
  }

  return payload;
}

