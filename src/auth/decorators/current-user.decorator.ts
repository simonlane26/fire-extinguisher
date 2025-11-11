import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  id: string;
  email: string;
  tenantId: string;
  role: string;
  name: string;
  tenant: {
    id: string;
    companyName: string;
    subdomain: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
