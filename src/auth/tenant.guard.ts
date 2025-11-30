import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

/**
 * TenantGuard ensures that authenticated users can only access
 * resources that belong to their tenant. This prevents cross-tenant data access.
 *
 * The guard compares the user's tenantId (from JWT) with the tenantId
 * in the request (from headers, params, or body).
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Extract tenant ID from various sources
    const requestTenantId =
      request.headers['x-tenant-id'] ||
      request.params.tenantId ||
      request.body?.tenantId ||
      request.query?.tenantId;

    // If no tenant ID in request, allow (user's own tenant will be used)
    if (!requestTenantId) {
      return true;
    }

    // Verify user belongs to the requested tenant
    if (user.tenantId !== requestTenantId) {
      throw new ForbiddenException(
        'You do not have access to this tenant resources',
      );
    }

    return true;
  }
}
