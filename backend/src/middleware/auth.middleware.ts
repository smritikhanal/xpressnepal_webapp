import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/auth.js';
import User from '../models/User.js';

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'customer' | 'seller' | 'superadmin';
      };
    }
  }
}

/**
 * Protect middleware
 * 
 * Verifies JWT token from Authorization header
 * and attaches user info to request object
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Not authorized - no token provided',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded: JwtPayload = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized - invalid token',
    });
  }
};

/**
 * Authorize middleware
 * 
 * Restricts access to specific roles
 * Must be used AFTER protect middleware
 * 
 * Usage: authorize('superadmin') or authorize('customer', 'seller')
 */
export const authorize = (...roles: Array<'customer' | 'seller' | 'superadmin'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
      return;
    }

    next();
  };
};

/**
 * Require Authentication
 * Alias for protect middleware for clearer intent
 */
export const requireAuth = protect;

/**
 * Require Superadmin
 * Must be used AFTER protect/requireAuth middleware
 */
export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'superadmin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Superadmin privileges required.',
    });
    return;
  }

  next();
};

/**
 * Require Seller
 * Must be used AFTER protect/requireAuth middleware
 */
export const requireSeller = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'seller') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Seller account required.',
    });
    return;
  }

  next();
};

/**
 * Require Seller or Superadmin
 * Allows both sellers and superadmins to access the route
 * Must be used AFTER protect/requireAuth middleware
 */
export const requireSellerOrSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'seller' && req.user.role !== 'superadmin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Seller or Superadmin privileges required.',
    });
    return;
  }

  next();
};

/**
 * Require Customer
 * Must be used AFTER protect/requireAuth middleware
 */
export const requireCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'customer') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Customer account required.',
    });
    return;
  }

  next();
};
