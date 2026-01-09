import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import * as ClientModel from '@/lib/mongodb/models/Client';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

/**
 * Verify client token from cookie
 */
export async function verifyClientToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('client_token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    
    // Verify the client still exists and is active
    const client = await ClientModel.getClientById(payload.clientId);
    if (!client) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Require client authentication - throws if not authenticated
 */
export async function requireClientAuth() {
  const payload = await verifyClientToken();

  if (!payload || payload.role !== 'client') {
    throw new Error('Unauthorized');
  }

  return payload;
}

/**
 * Create client JWT token
 */
export async function createClientToken(client) {
  const token = await new SignJWT({
    clientId: client._id.toString(),
    email: client.email,
    name: client.name,
    role: 'client',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // Clients get 30 days
    .sign(secret);

  return token;
}

/**
 * Check if user has access to a specific client's data
 */
export async function hasClientAccess(clientId) {
  const payload = await verifyClientToken();
  
  if (!payload || payload.role !== 'client') {
    return false;
  }

  return payload.clientId === clientId;
}

/**
 * Get current client from token
 */
export async function getCurrentClient() {
  const payload = await verifyClientToken();
  
  if (!payload || payload.role !== 'client') {
    return null;
  }

  const client = await ClientModel.getClientById(payload.clientId);
  return client;
}

