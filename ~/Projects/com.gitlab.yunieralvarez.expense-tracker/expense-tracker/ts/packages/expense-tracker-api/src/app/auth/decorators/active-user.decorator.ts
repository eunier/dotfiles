import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from '~/app/auth/constants/auth.constants';
import { ActiveUserData } from '~/app/auth/models/active-user-data.model';

export const ActiveUser = createParamDecorator(
	(field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
		return field ? user?.[field] : user;
	},
);
