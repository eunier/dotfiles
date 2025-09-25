import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '~/app/auth/guards/auth/auth.guard';

export const AuthGuardProvider: Provider = {
	provide: APP_GUARD,
	useClass: AuthGuard,
};
