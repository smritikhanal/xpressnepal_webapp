import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password
 * 
 * WHY bcrypt?
 * - Automatically handles salt generation
 * - Resistant to rainbow table attacks
 * - Configurable work factor (SALT_ROUNDS)
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain-text password with stored hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * JWT Payload Interface
 */
export interface JwtPayload {
  userId: string;
  role: 'customer' | 'seller' | 'superadmin';
}

/**
 * Generate JWT access token
 * 
 * WHY JWT?
 * - Stateless: no session store needed
 * - Contains user info in payload
 * - Self-verifying with signature
 */
export const generateToken = (userId: string, role: 'customer' | 'seller' | 'superadmin'): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload: JwtPayload = { userId, role };
  
  // Token expires in 7 days (for development simplicity)
  // In production, use shorter access tokens + refresh tokens
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, secret) as JwtPayload;
};
