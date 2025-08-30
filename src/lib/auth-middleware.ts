import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export type UserRole = 'user' | 'mechanic' | 'admin';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    requiredRole?: UserRole[];
    requireAuth?: boolean;
  }
) {
  return async (req: NextRequest) => {
    const { requiredRole = [], requireAuth = true } = options || {};

    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (requireAuth && !token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (token && requiredRole.length > 0 && !requiredRole.includes(token.role as UserRole)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const authenticatedRequest = req as AuthenticatedRequest;
      if (token) {
        authenticatedRequest.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as UserRole,
          phone: token.phone as string,
        };
      }

      return handler(authenticatedRequest);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}

// Helper functions for role checking
export const requireAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
  withAuth(handler, { requireAuth: true });

export const requireAdmin = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
  withAuth(handler, { requiredRole: ['admin'] });

export const requireMechanic = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
  withAuth(handler, { requiredRole: ['mechanic', 'admin'] });

export const requireUser = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
  withAuth(handler, { requiredRole: ['user', 'mechanic', 'admin'] });

// Validation helpers
export function validateRole(role: string): role is UserRole {
  return ['user', 'mechanic', 'admin'].includes(role);
}

export function hasPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function isMechanic(userRole: UserRole): boolean {
  return userRole === 'mechanic';
}

export function isUser(userRole: UserRole): boolean {
  return userRole === 'user';
}