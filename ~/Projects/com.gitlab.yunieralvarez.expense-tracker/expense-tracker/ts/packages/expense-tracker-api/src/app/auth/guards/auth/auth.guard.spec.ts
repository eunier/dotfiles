import { faker } from '@faker-js/faker/.';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { AuthType } from '~/app/auth/enums/auth-type.enum';
import { AccessTokenGuard } from '~/app/auth/guards/access-token/access-token.guard';
import { AuthGuard } from '~/app/auth/guards/auth/auth.guard';
import { Utils } from '~/app/utils/services/utils/utils.service';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let reflector: Reflector;
	let context: ExecutionContext;
	let accessTokenGuard: AccessTokenGuard;

	beforeEach(() => {
		reflector = {
			get: jest.fn() as Reflector['get'],
		} satisfies Partial<Reflector> as Reflector;

		context = {
			getHandler: jest.fn() as ExecutionContext['getHandler'],
		} satisfies Partial<ExecutionContext> as ExecutionContext;

		accessTokenGuard = {
			canActivate: jest.fn() as AccessTokenGuard['canActivate'],
		} satisfies Partial<AccessTokenGuard> as AccessTokenGuard;

		guard = new AuthGuard(accessTokenGuard, reflector);

		faker.seed(
			Utils.genSeedFromString(
				expect.getState().currentTestName ?? AuthGuard.name,
			),
		);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	describe('canActivate', () => {
		describe('when no AuthType is provided', () => {
			it('should return true', async () => {
				reflector.get = jest.fn().mockReturnValue(null);
				accessTokenGuard.canActivate = jest.fn().mockReturnValue(true);
				const result = await guard.canActivate(context);
				expect(result).toBe(true);
			});
		});

		describe('when AuthType.None is provided', () => {
			it('should return true', async () => {
				reflector.get = jest.fn().mockReturnValue(AuthType.None);
				const result = await guard.canActivate(context);
				expect(result).toBe(true);
			});
		});

		describe('when AuthType.Bearer is provided', () => {
			describe('when access token guard canActivate returns true', () => {
				it('should return true', async () => {
					reflector.get = jest.fn().mockReturnValue(AuthType.Bearer);
					accessTokenGuard.canActivate = jest.fn().mockReturnValue(true);
					const result = await guard.canActivate(context);
					expect(result).toBe(true);
				});
			});

			describe('when access token guard canActivate returns false', () => {
				it('should throw UnauthorizedException', async () => {
					reflector.get = jest.fn().mockReturnValue(AuthType.Bearer);
					accessTokenGuard.canActivate = jest.fn().mockReturnValue(false);

					try {
						await guard.canActivate(context);
						fail('Expected UnauthorizedException to be thrown');
					} catch (err) {
						expect(err).toBeInstanceOf(UnauthorizedException);
						expect((err as UnauthorizedException).message).toBe('Unauthorized');
					}
				});
			});

			describe('when access token guard canActivate throws an Error', () => {
				it('should throw the same Error', async () => {
					reflector.get = jest.fn().mockReturnValue(AuthType.Bearer);

					accessTokenGuard.canActivate = jest
						.fn()
						.mockRejectedValue(new Error(faker.lorem.sentence()));

					try {
						await guard.canActivate(context);
						fail('Expected Error to be thrown');
					} catch (err) {
						expect(err).toBeInstanceOf(Error);
						expect((err as Error).message).toBe('Adeo tunc caecus.');
					}
				});
			});

			describe('when access token guard canActivate throws an string', () => {
				it('should throw the a Error with that string', async () => {
					reflector.get = jest.fn().mockReturnValue(AuthType.Bearer);

					accessTokenGuard.canActivate = jest
						.fn()
						.mockRejectedValue(faker.lorem.sentence());

					try {
						await guard.canActivate(context);
						fail('Expected Error to be thrown');
					} catch (err) {
						expect(typeof err).toBe('string');
						expect(err as string).toBe(
							'Deorsum anser tondeo adipiscor voluptatibus crinis expedita.',
						);
					}
				});
			});

			describe('when the guard.canActivate is a Promise that resolves to true', () => {
				it('should return true', async () => {
					reflector.get = jest.fn().mockReturnValue(AuthType.Bearer);
					accessTokenGuard.canActivate = jest.fn().mockResolvedValue(true);
					const result = await guard.canActivate(context);
					expect(result).toBe(true);
				});
			});

			describe('when the guard.canActivate is a observable that resolves to true', () => {
				it('should return true', async () => {
					reflector.get = jest.fn().mockReturnValue(AuthType.Bearer);
					accessTokenGuard.canActivate = jest.fn().mockReturnValue(of(true));
					const result = await guard.canActivate(context);
					expect(result).toBe(true);
				});
			});

			describe('when the guard.canActivate return other type', () => {
				it('should throw UnauthorizedException', async () => {
					reflector.get = jest.fn().mockReturnValue(AuthType.Bearer);
					accessTokenGuard.canActivate = jest.fn().mockReturnValue(1);

					try {
						await guard.canActivate(context);
						fail('Expected UnauthorizedException to be thrown');
					} catch (err) {
						expect(err).toBeInstanceOf(UnauthorizedException);
						expect((err as UnauthorizedException).message).toBe('Unauthorized');
					}
				});
			});
		});
	});
});
